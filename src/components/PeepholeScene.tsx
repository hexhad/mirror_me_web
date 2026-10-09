"use client";
/* eslint-disable react-hooks/immutability -- three.js objects (materials, the
   renderer's canvas style, refs) are mutated per frame in useFrame and in
   pointer handlers. That is how React Three Fiber keeps animation out of
   React renders, so these rules don't apply here. */

import { RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import QRCode from "qrcode";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * The idea of MirrorMe as a toy: a phone floats over a desktop and its screen
 * shows exactly the patch of desktop underneath it, like a simulator window
 * whose camera looks through to whatever is behind it. Drag the phone around;
 * park it over the QR card and the "camera" reads it.
 */

const DESK_W = 16;
const DESK_H = 10;
const TEX_W = 1600;
const TEX_H = 1000;
const PHONE_W = 2.1;
const PHONE_H = 4.3;
const SCREEN_W = 1.86;
const SCREEN_H = 4.02;
const QR_CENTER = new THREE.Vector2(1.55, -0.85);
const QR_SIZE = 1.5;
const BOUNDS = { x: 1.9, y: 1.1 };

export type SceneProps = {
  reducedMotion: boolean;
  onScan: (reading: boolean) => void;
};

export default function PeepholeScene(props: SceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      resize={{ scroll: false, debounce: 0 }}
      camera={{ position: [0, -3.4, 10.4], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[-4, 6, 8]} intensity={1.4} />
      <Desk {...props} />
    </Canvas>
  );
}

/** Wallpaper photo plus a QR card, painted once into a canvas texture. */
function useDeskTexture() {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    let cancelled = false;
    const canvas = document.createElement("canvas");
    canvas.width = TEX_W;
    canvas.height = TEX_H;
    const ctx = canvas.getContext("2d")!;
    const photo = new Image();
    photo.src = "/desk-photo.jpg";
    photo.onload = async () => {
      ctx.drawImage(photo, 0, 0, TEX_W, TEX_H);
      ctx.fillStyle = "rgba(8, 10, 14, 0.08)";
      ctx.fillRect(0, 0, TEX_W, TEX_H);

      // QR card, in desk units converted to texture pixels.
      const px = (v: number) => (v / DESK_W) * TEX_W;
      const cx = px(QR_CENTER.x + DESK_W / 2);
      const cy = ((DESK_H / 2 - QR_CENTER.y) / DESK_H) * TEX_H;
      const size = px(QR_SIZE);
      const pad = size * 0.09;
      ctx.fillStyle = "#f7f8f9";
      roundRect(ctx, cx - size / 2 - pad, cy - size / 2 - pad, size + pad * 2, size + pad * 2, pad * 1.4);
      ctx.fill();
      const qr = document.createElement("canvas");
      await QRCode.toCanvas(qr, "Hello from your desktop", {
        margin: 0,
        width: Math.round(size),
        color: { dark: "#15171c", light: "#f7f8f9" },
      });
      ctx.drawImage(qr, cx - size / 2, cy - size / 2, size, size);

      if (cancelled) return;
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      setTexture(tex);
    };
    return () => {
      cancelled = true;
    };
  }, []);
  return texture;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const screenVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

// Each screen pixel shows the desk where the viewer's line of sight through it
// lands (so the screen lines up with the desk around the phone, like a window),
// plus a touch of lens fringing, rounded corners, a camera island and a shutter ring.
const screenFragment = /* glsl */ `
  uniform sampler2D uDesk;
  uniform vec2 uDeskSize;
  uniform float uAspect;
  uniform float uScan;
  varying vec2 vUv;
  varying vec3 vWorld;

  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec3 ray = vWorld - cameraPosition;
    vec3 hit = cameraPosition + ray * (-cameraPosition.z / ray.z);
    vec2 uv = hit.xy / uDeskSize + 0.5;
    vec2 fromCenter = vUv - 0.5;
    float fringe = 0.0016 * length(fromCenter) * 2.0;
    vec3 color;
    color.r = texture2D(uDesk, uv + fromCenter * fringe).r;
    color.g = texture2D(uDesk, uv).g;
    color.b = texture2D(uDesk, uv - fromCenter * fringe).b;

    // Gentle vignette, like a small lens.
    color *= 1.0 - 0.28 * smoothstep(0.25, 0.75, length(fromCenter * vec2(uAspect, 1.0)));

    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    // Camera island at the top.
    float island = roundedBox(p - vec2(0.0, 0.455), vec2(0.075, 0.016), 0.016);
    color = mix(vec3(0.02), color, smoothstep(0.0, 0.003, island));
    // Shutter ring at the bottom.
    float ring = abs(length(p - vec2(0.0, -0.40)) - 0.042);
    color = mix(color, vec3(0.97), (1.0 - smoothstep(0.004, 0.008, ring)) * 0.9);
    // Viewfinder brackets light up while a code is being read.
    vec2 b = abs(p) - vec2(0.13, 0.13);
    float bracket = max(b.x, b.y);
    float corner = step(0.06, abs(p.x)) * step(0.06, abs(p.y));
    float frame = (1.0 - smoothstep(0.0, 0.006, abs(bracket))) * corner;
    color = mix(color, vec3(0.204, 0.827, 0.6), frame * uScan);

    float edge = roundedBox(p, vec2(0.5 * uAspect, 0.5), 0.06);
    float alpha = 1.0 - smoothstep(-0.002, 0.002, edge);
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

function Desk({ reducedMotion, onScan }: SceneProps) {
  const desk = useDeskTexture();
  const phone = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const dragging = useRef(false);
  const lastInput = useRef(-10);
  const start = reducedMotion ? new THREE.Vector2(QR_CENTER.x - 0.1, QR_CENTER.y + 0.5) : new THREE.Vector2(-0.9, 0.3);
  const target = useRef(start);
  const pos = useRef(start.clone());
  const velocity = useRef(new THREE.Vector2());
  const scanning = useRef(false);
  const { gl, clock } = useThree();

  // A release anywhere (even outside the canvas) ends the drag.
  useEffect(() => {
    const up = () => {
      dragging.current = false;
    };
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: screenVertex,
        fragmentShader: screenFragment,
        transparent: true,
        uniforms: {
          uDesk: { value: null },
          uDeskSize: { value: new THREE.Vector2(DESK_W, DESK_H) },
          uAspect: { value: SCREEN_W / SCREEN_H },
          uScan: { value: 0 },
        },
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => {
    material.uniforms.uDesk.value = desk;
  }, [desk, material]);

  const shadowTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 8, 64, 64, 64);
    grad.addColorStop(0, "rgba(0,0,0,0.55)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const idle = !dragging.current && t - lastInput.current > 3.5;
    if (idle && !reducedMotion) {
      // Wander over the desk and linger on the QR card now and then.
      const k = (Math.sin(t * 0.21) + 1) / 2;
      const wander = new THREE.Vector2(Math.sin(t * 0.37) * 1.6, Math.cos(t * 0.29) * 0.8);
      target.current.copy(wander.lerp(new THREE.Vector2(QR_CENTER.x, QR_CENTER.y + 0.55), Math.pow(k, 4)));
    }
    const prev = pos.current.clone();
    const damp = dragging.current ? 14 : 3.2;
    pos.current.x = THREE.MathUtils.damp(pos.current.x, target.current.x, damp, delta);
    pos.current.y = THREE.MathUtils.damp(pos.current.y, target.current.y, damp, delta);
    velocity.current.copy(pos.current).sub(prev).divideScalar(Math.max(delta, 1e-3));

    if (phone.current) {
      const lift = dragging.current ? 0.95 : 0.7;
      phone.current.position.set(pos.current.x, pos.current.y, THREE.MathUtils.damp(phone.current.position.z, lift, 6, delta));
      phone.current.rotation.x = THREE.MathUtils.damp(phone.current.rotation.x, THREE.MathUtils.clamp(-velocity.current.y * 0.05, -0.25, 0.25), 6, delta);
      phone.current.rotation.y = THREE.MathUtils.damp(phone.current.rotation.y, THREE.MathUtils.clamp(velocity.current.x * 0.05, -0.25, 0.25), 6, delta);
    }
    if (shadow.current && phone.current) {
      shadow.current.position.set(pos.current.x + 0.25, pos.current.y - 0.35, 0.01);
      const s = 1 + (phone.current.position.z - 0.7) * 0.6;
      shadow.current.scale.set(s, s, 1);
    }

    // "Read" the QR code when it sits inside the viewfinder.
    const dx = Math.abs(pos.current.x - QR_CENTER.x);
    const dy = Math.abs(pos.current.y - QR_CENTER.y);
    const reading = dx < 0.45 && dy < 0.75;
    material.uniforms.uScan.value = THREE.MathUtils.damp(material.uniforms.uScan.value, reading ? 1 : 0, 8, delta);
    if (reading !== scanning.current) {
      scanning.current = reading;
      onScan(reading);
    }
  });

  const toDesk = (e: ThreeEvent<PointerEvent>) => {
    target.current.set(
      THREE.MathUtils.clamp(e.point.x, -BOUNDS.x, BOUNDS.x),
      THREE.MathUtils.clamp(e.point.y, -BOUNDS.y, BOUNDS.y),
    );
  };

  return (
    <group>
      <mesh
        onPointerMove={(e) => {
          if (!dragging.current) return;
          lastInput.current = clock.elapsedTime;
          toDesk(e);
        }}
        onPointerUp={() => {
          dragging.current = false;
          gl.domElement.style.cursor = "grab";
        }}
      >
        <planeGeometry args={[DESK_W, DESK_H]} />
        {/* Separate keys: three.js won't recompile a material when a map is added later. */}
        {desk ? (
          <meshBasicMaterial key="desk" map={desk} toneMapped={false} />
        ) : (
          <meshBasicMaterial key="loading" color="#1b1e24" />
        )}
      </mesh>

      <mesh ref={shadow} position={[0, 0, 0.01]}>
        <planeGeometry args={[PHONE_W * 1.5, PHONE_H * 1.25]} />
        <meshBasicMaterial map={shadowTexture} transparent depthWrite={false} />
      </mesh>

      <group
        ref={phone}
        onPointerDown={(e) => {
          e.stopPropagation();
          dragging.current = true;
          lastInput.current = clock.elapsedTime;
          gl.domElement.style.cursor = "grabbing";
          (e.target as Element | null)?.setPointerCapture?.(e.pointerId);
        }}
        onPointerOver={() => {
          if (!dragging.current) gl.domElement.style.cursor = "grab";
        }}
        onPointerOut={() => {
          if (!dragging.current) gl.domElement.style.cursor = "auto";
        }}
      >
        <RoundedBox args={[PHONE_W, PHONE_H, 0.2]} radius={0.28} smoothness={6}>
          <meshStandardMaterial color="#1a1c21" metalness={0.65} roughness={0.32} />
        </RoundedBox>
        <mesh position={[0, 0, 0.101]} material={material}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        </mesh>
      </group>
    </group>
  );
}
