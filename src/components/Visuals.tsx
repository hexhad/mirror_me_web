"use client";

import { LiquidMetal } from "@paper-design/shaders-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/** WebGL only on the client, and never for people who asked for less motion. */
export function useMotionOK() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setOk(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return ok;
}

const Gradient = dynamic(
  async () => {
    const { ShaderGradientCanvas, ShaderGradient } = await import("@shadergradient/react");
    function G() {
      return (
        <ShaderGradientCanvas
          style={{ position: "absolute", inset: 0 }}
          pixelDensity={1}
          fov={45}
          pointerEvents="none"
          lazyLoad
        >
          <ShaderGradient
            control="props"
            type="waterPlane"
            animate="on"
            uSpeed={0.1}
            uStrength={1.4}
            uDensity={1.2}
            uFrequency={5.5}
            uAmplitude={0}
            positionX={0}
            positionY={0}
            positionZ={0}
            rotationX={50}
            rotationY={0}
            rotationZ={-60}
            color1="#1f9d72"
            color2="#0b0c0f"
            color3="#1d3a36"
            reflection={0.1}
            cAzimuthAngle={180}
            cPolarAngle={80}
            cDistance={2.8}
            cameraZoom={9.1}
            lightType="3d"
            brightness={1}
            envPreset="city"
            grain="on"
          />
        </ShaderGradientCanvas>
      );
    }
    return G;
  },
  { ssr: false },
);

/** Slow liquid gradient behind the download section, after ruucm/shadergradient. */
export function DownloadGradient() {
  const ok = useMotionOK();
  return (
    <div aria-hidden className="shader-backdrop">
      <div className="shader-backdrop-fallback" />
      {ok && <Gradient />}
      <div className="shader-backdrop-wash" />
    </div>
  );
}

/** The MirrorMe mark poured in liquid metal, after paper-design/liquid-logo. */
export function LiquidMark({ size = 220 }: { size?: number }) {
  const ok = useMotionOK();
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {ok ? (
        <LiquidMetal
          image="/mark.svg"
          colorBack="#00000000"
          colorTint="#9df2cf"
          repetition={4}
          softness={0.45}
          shiftRed={0.3}
          shiftBlue={0.3}
          distortion={0.1}
          contour={0.4}
          angle={70}
          speed={0.6}
          scale={0.8}
          fit="contain"
          style={{ width: size, height: size }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/mark.svg" alt="" width={size} height={size} className="opacity-80" />
      )}
    </div>
  );
}
