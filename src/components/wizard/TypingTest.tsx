"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TYPING_SAMPLE } from "@/lib/assessment";
import { cn } from "@/lib/utils";

interface Props {
  value: { wpm: number; accuracy: number; completed: boolean };
  onComplete: (result: { wpm: number; accuracy: number; completed: boolean }) => void;
}

export function TypingTest({ value, onComplete }: Props) {
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finished, setFinished] = useState(value.completed);

  const words = TYPING_SAMPLE.split(" ");

  const accuracy = useMemo(() => {
    if (!typed.length) return 100;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === TYPING_SAMPLE[i]) correct++;
    }
    return Math.round((correct / typed.length) * 100);
  }, [typed]);

  const handleChange = (v: string) => {
    if (finished) return;
    if (!startedAt && v.length > 0) setStartedAt(Date.now());
    setTyped(v);

    if (v.length >= TYPING_SAMPLE.length) {
      const elapsedMin = ((Date.now() - (startedAt ?? Date.now())) || 1) / 60000;
      const wpm = Math.max(1, Math.round(TYPING_SAMPLE.trim().split(/\s+/).length / elapsedMin));
      setFinished(true);
      onComplete({ wpm, accuracy, completed: true });
    }
  };

  const reset = () => {
    setTyped("");
    setStartedAt(null);
    setFinished(false);
    onComplete({ wpm: 0, accuracy: 0, completed: false });
  };

  return (
    <div className="rounded-xl border border-[var(--border)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Timer className="h-4 w-4 text-brand-600" /> Typing Test
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span>Accuracy: <strong className="text-[var(--text)]">{accuracy}%</strong></span>
          {finished && (
            <span>Speed: <strong className="text-brand-600">{value.wpm || 0} WPM</strong></span>
          )}
        </div>
      </div>

      <div className="mb-3 select-none rounded-lg bg-gray-50 p-3 text-sm leading-relaxed dark:bg-slate-800/60">
        {words.map((word, wi) => {
          // compute char offset for this word
          const offset = words.slice(0, wi).join(" ").length + (wi > 0 ? 1 : 0);
          return (
            <span key={wi}>
              {word.split("").map((ch, ci) => {
                const idx = offset + ci;
                let state: "pending" | "correct" | "wrong" = "pending";
                if (idx < typed.length) state = typed[idx] === ch ? "correct" : "wrong";
                return (
                  <span
                    key={ci}
                    className={cn(
                      state === "correct" && "text-green-600 dark:text-green-400",
                      state === "wrong" && "bg-red-200 text-red-700 dark:bg-red-900/50 dark:text-red-300",
                      idx === typed.length && "border-b-2 border-brand-500",
                    )}
                  >
                    {ch}
                  </span>
                );
              })}{" "}
            </span>
          );
        })}
      </div>

      <textarea
        value={typed}
        onChange={(e) => handleChange(e.target.value)}
        disabled={finished}
        rows={3}
        placeholder="Start typing the text above…"
        className="input-base resize-none font-mono"
        aria-label="Typing test input"
      />

      <div className="mt-3 flex items-center justify-between">
        {finished ? (
          <p className="text-sm font-medium text-green-600">
            ✓ Completed — {value.wpm} WPM at {value.accuracy}% accuracy
          </p>
        ) : (
          <p className="text-xs text-muted">
            {typed.length}/{TYPING_SAMPLE.length} characters
          </p>
        )}
        <Button type="button" variant="ghost" size="sm" onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>
    </div>
  );
}
