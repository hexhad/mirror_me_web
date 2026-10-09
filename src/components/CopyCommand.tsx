"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

/** A Terminal command with a one-click copy button. */
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked: the command stays selectable as plain text.
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-black/35 py-2 pl-4 pr-2 shadow-[inset_0_0_0_1px_var(--line)]">
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-white/85 select-all">
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="press btn-ghost inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "done" : "copy"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="inline-flex items-center gap-1.5"
          >
            {copied ? <Check size={14} weight="bold" className="text-[var(--accent)]" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
