"use client";

import { useWizard } from "../WizardContext";
import { TypingTest } from "../TypingTest";
import { RadioCards, SelectField } from "@/components/ui/Field";
import { PROFICIENCY } from "@/lib/options";
import {
  MCQ_SECTIONS,
  TOOL_RATINGS,
  PERSONALITY_ITEMS,
  LIKERT_LABELS,
} from "@/lib/assessment";
import type { ProficiencyLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StepAssessment() {
  const { app, setApp, errors } = useWizard();
  const asm = app.assessment;

  const setAnswer = (qid: string, idx: number) =>
    setApp((prev) => ({
      ...prev,
      assessment: { ...prev.assessment, answers: { ...prev.assessment.answers, [qid]: idx } },
    }));

  const setRating = (id: string, level: ProficiencyLevel) =>
    setApp((prev) => ({
      ...prev,
      assessment: { ...prev.assessment, ratings: { ...prev.assessment.ratings, [id]: level } },
    }));

  const setPersonality = (id: string, val: number) =>
    setApp((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        personality: { ...prev.assessment.personality, [id]: val },
      },
    }));

  const setTyping = (result: typeof asm.typing) =>
    setApp((prev) => ({ ...prev, assessment: { ...prev.assessment, typing: result } }));

  return (
    <div className="space-y-8">
      <p className="rounded-lg bg-brand-50 p-3 text-sm text-brand-800 dark:bg-brand-950/40 dark:text-brand-200">
        This assessment helps us understand your strengths. Answer honestly — there is no time
        pressure. Your answers save automatically as you go.
      </p>

      {/* Scored MCQ sections */}
      {MCQ_SECTIONS.map((section) => (
        <section key={section.id}>
          <h4 className="mb-1 text-base font-semibold">{section.title}</h4>
          {section.description && (
            <p className="mb-3 rounded-md bg-gray-50 p-3 text-sm italic text-muted dark:bg-slate-800/60">
              {section.description}
            </p>
          )}
          <div className="space-y-4">
            {section.questions.map((q) => (
              <div key={q.id}>
                <p className="mb-2 text-sm font-medium">{q.prompt}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, idx) => {
                    const selected = asm.answers[q.id] === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAnswer(q.id, idx)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left text-sm transition",
                          selected
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-950/40"
                            : "border-[var(--border)] hover:border-brand-300",
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Tool proficiency ratings */}
      <section>
        <h4 className="mb-3 text-base font-semibold">Software Proficiency</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          {TOOL_RATINGS.map((t) => (
            <SelectField
              key={t.id}
              label={t.label}
              placeholder="Select your level"
              options={PROFICIENCY}
              value={asm.ratings[t.id] ?? ""}
              onChange={(e) => setRating(t.id, e.target.value as ProficiencyLevel)}
            />
          ))}
        </div>
      </section>

      {/* Typing test */}
      <section>
        <h4 className="mb-3 text-base font-semibold">Typing Speed</h4>
        <TypingTest value={asm.typing} onComplete={setTyping} />
        {errors.typing && <p className="mt-2 text-xs text-red-600">{errors.typing}</p>}
      </section>

      {/* Work-style questions (Likert) */}
      <section>
        <h4 className="mb-3 text-base font-semibold">Work Style</h4>
        <div className="space-y-4">
          {PERSONALITY_ITEMS.map((item) => (
            <div key={item.id}>
              <RadioCards
                label={item.statement}
                columns={5}
                value={asm.personality[item.id] ? String(asm.personality[item.id]) : ""}
                onChange={(v) => setPersonality(item.id, Number(v))}
                options={LIKERT_LABELS.map((label, i) => ({
                  value: String(i + 1),
                  label: String(i + 1),
                  description: label,
                }))}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
