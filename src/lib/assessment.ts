// Assessment content for Step 5 — kept to the basics: a short aptitude check,
// a few software self-ratings, a typing test, and a couple of work-style questions.

export interface McqQuestion {
  id: string;
  prompt: string;
  options: string[];
  correct: number; // index of correct option
}

export interface McqSection {
  id: string;
  title: string;
  description?: string;
  questions: McqQuestion[];
}

export const MCQ_SECTIONS: McqSection[] = [
  {
    id: "aptitude",
    title: "Quick Aptitude Check",
    description: "A few short questions covering numeracy, English and attention to detail.",
    questions: [
      {
        id: "math1",
        prompt: "What is 15% of 320?",
        options: ["42", "48", "56", "38"],
        correct: 1,
      },
      {
        id: "eng1",
        prompt: "Select the synonym of “meticulous”.",
        options: ["Careless", "Thorough", "Rapid", "Vague"],
        correct: 1,
      },
      {
        id: "att1",
        prompt: "Which pair is an EXACT match?",
        options: [
          "SWT-2026-8F3A2C  /  SWT-2026-8F3A2C",
          "SWT-2026-8F3A2C  /  SWT-2026-8F3AZC",
          "SWT-2026-8F3A2C  /  SWT-2026-8F3A2G",
          "SWT-2026-8F3A2C  /  SWT-2026-8FEA2C",
        ],
        correct: 0,
      },
    ],
  },
];

export interface ToolRating {
  id: string;
  label: string;
}

// Self-rated proficiency — just the core tools.
export const TOOL_RATINGS: ToolRating[] = [
  { id: "ms_word", label: "Microsoft Word" },
  { id: "excel", label: "Microsoft Excel" },
  { id: "email", label: "Email" },
];

export const TYPING_SAMPLE =
  "The SWASTASK platform connects skilled remote workers with meaningful digital tasks. " +
  "Please read each instruction carefully before you begin.";

export interface PersonalityItem {
  id: string;
  statement: string;
}

// A couple of quick work-style questions (1 = Strongly disagree, 5 = Strongly agree).
export const PERSONALITY_ITEMS: PersonalityItem[] = [
  { id: "p1", statement: "I complete tasks on time even without supervision." },
  { id: "p2", statement: "I double-check my work for errors before submitting." },
];

export const LIKERT_LABELS = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
];

/** Compute a 0–100 assessment score from scored MCQ sections. */
export function computeAssessmentScore(answers: Record<string, number>): number {
  let total = 0;
  let correct = 0;
  for (const section of MCQ_SECTIONS) {
    for (const q of section.questions) {
      total += 1;
      if (answers[q.id] === q.correct) correct += 1;
    }
  }
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function countMcqQuestions(): number {
  return MCQ_SECTIONS.reduce((sum, s) => sum + s.questions.length, 0);
}
