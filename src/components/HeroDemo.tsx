"use client";

import { QrCode } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";

const PeepholeScene = dynamic(() => import("./PeepholeScene"), {
  ssr: false,
  loading: () => <div className="demo-skeleton" />,
});

const reducedMotionQuery = () => window.matchMedia("(prefers-reduced-motion: reduce)");
function subscribeReducedMotion(onChange: () => void) {
  const mq = reducedMotionQuery();
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** The draggable phone-over-desktop demo, with a read-out when the "camera" sees the QR card. */
export function HeroDemo() {
  const reduced = useSyncExternalStore(subscribeReducedMotion, () => reducedMotionQuery().matches, () => null);
  const [reading, setReading] = useState(false);

  return (
    <div className="demo">
      <div className="absolute inset-0">
        {reduced === null ? <div className="demo-skeleton" /> : <PeepholeScene reducedMotion={reduced} onScan={setReading} />}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
        <AnimatePresence>
          {reading && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="glass-pill flex items-center gap-2 px-4 py-2 text-sm text-white/90"
            >
              <QrCode size={16} weight="bold" className="text-[var(--accent)]" />
              QR code read: github.com/hexhad/mirror-me
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="pointer-events-none absolute left-5 top-4 text-xs text-white/55">Drag the phone</p>
    </div>
  );
}
