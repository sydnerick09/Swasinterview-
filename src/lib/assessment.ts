// Assessment content for Step 5. Scored multiple-choice questions, self-rated tool
// proficiency, a typing test, free-response tasks, and a personality inventory.

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
    id: "logical",
    title: "Logical Reasoning",
    questions: [
      {
        id: "log1",
        prompt: "Which number completes the sequence: 2, 6, 12, 20, 30, __ ?",
        options: ["36", "40", "42", "44"],
        correct: 2,
      },
      {
        id: "log2",
        prompt: "All engineers are problem-solvers. Some problem-solvers are artists. Therefore:",
        options: [
          "All engineers are artists",
          "Some engineers may be artists",
          "No engineers are artists",
          "All artists are engineers",
        ],
        correct: 1,
      },
      {
        id: "log3",
        prompt: "If MONDAY is coded as ONMDYA, how is FRIDAY coded (swap pairs)?",
        options: ["RFIDYA", "RFDIAY", "IRFADY", "RFIDAY"],
        correct: 3,
      },
    ],
  },
  {
    id: "math",
    title: "Mathematics",
    questions: [
      {
        id: "math1",
        prompt: "A task pays $0.15 per item. How much for 240 items?",
        options: ["$32", "$36", "$28", "$40"],
        correct: 1,
      },
      {
        id: "math2",
        prompt: "What is 15% of 320?",
        options: ["48", "42", "56", "38"],
        correct: 0,
      },
      {
        id: "math3",
        prompt: "If a file is 4,096 KB, approximately how many MB is it?",
        options: ["0.4 MB", "4 MB", "40 MB", "400 MB"],
        correct: 1,
      },
    ],
  },
  {
    id: "english",
    title: "English",
    questions: [
      {
        id: "eng1",
        prompt: "Choose the correctly punctuated sentence.",
        options: [
          "Its been a long day, and were tired.",
          "It's been a long day, and we're tired.",
          "Its' been a long day, and were' tired.",
          "It's been a long day, and were tired.",
        ],
        correct: 1,
      },
      {
        id: "eng2",
        prompt: "Select the synonym of 'meticulous'.",
        options: ["Careless", "Thorough", "Rapid", "Vague"],
        correct: 1,
      },
      {
        id: "eng3",
        prompt: "Choose the grammatically correct option: 'The team ___ finished its report.'",
        options: ["have", "has", "having", "are"],
        correct: 1,
      },
    ],
  },
  {
    id: "reading",
    title: "Reading Comprehension",
    description:
      "Read: “Remote data workers must balance speed with accuracy. While quotas encourage volume, consistent quality is what sustains long-term client relationships and repeat work.”",
    questions: [
      {
        id: "read1",
        prompt: "According to the passage, what sustains long-term client relationships?",
        options: ["Speed", "Volume", "Consistent quality", "Large quotas"],
        correct: 2,
      },
      {
        id: "read2",
        prompt: "The passage implies that quotas primarily encourage:",
        options: ["Accuracy", "Volume", "Creativity", "Communication"],
        correct: 1,
      },
    ],
  },
  {
    id: "attention",
    title: "Attention to Detail",
    questions: [
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
      {
        id: "att2",
        prompt: "Which email address is correctly formatted?",
        options: [
          "jane.doe@@swastask.com",
          "jane.doe@swastask,com",
          "jane.doe@swastask.com",
          "jane.doe@ swastask.com",
        ],
        correct: 2,
      },
    ],
  },
];

export interface ToolRating {
  id: string;
  label: string;
}

// Self-rated proficiency (Microsoft Word, Excel, Google Docs, Email, Web Browsing)
export const TOOL_RATINGS: ToolRating[] = [
  { id: "ms_word", label: "Microsoft Word" },
  { id: "excel", label: "Microsoft Excel" },
  { id: "google_docs", label: "Google Docs" },
  { id: "email", label: "Email (compose, attach, organise)" },
  { id: "web_browsing", label: "Web Browsing & Search" },
];

export interface FreeResponseTask {
  id: string;
  title: string;
  prompt: string;
  minWords: number;
  placeholder: string;
}

export const FREE_RESPONSE_TASKS: FreeResponseTask[] = [
  {
    id: "copywriting",
    title: "Copywriting",
    prompt:
      "Write a short, persuasive product description (40–80 words) for a reusable water bottle.",
    minWords: 40,
    placeholder: "Write your product description here…",
  },
  {
    id: "research",
    title: "Research",
    prompt:
      "In 3–5 sentences, explain how you would verify whether an online source is trustworthy.",
    minWords: 30,
    placeholder: "Describe your approach…",
  },
  {
    id: "data_entry",
    title: "Data Entry",
    prompt:
      "Transcribe this exactly: “Invoice #4471 — Acme Ltd — $1,284.50 — Due 2026-08-15”",
    minWords: 3,
    placeholder: "Type the line exactly as shown…",
  },
];

export const TYPING_SAMPLE =
  "The SWASTASK platform connects skilled remote workers with meaningful digital tasks. " +
  "Accuracy and consistency matter more than raw speed, so read each instruction carefully " +
  "before you begin and always double check your work before submitting it.";

export interface PersonalityItem {
  id: string;
  statement: string;
}

// Likert-scale personality inventory (1 = Strongly disagree, 5 = Strongly agree)
export const PERSONALITY_ITEMS: PersonalityItem[] = [
  { id: "p1", statement: "I complete tasks on time even without supervision." },
  { id: "p2", statement: "I double-check my work for errors before submitting." },
  { id: "p3", statement: "I stay calm and focused under tight deadlines." },
  { id: "p4", statement: "I enjoy repetitive tasks that require precision." },
  { id: "p5", statement: "I communicate proactively when I face a blocker." },
  { id: "p6", statement: "I adapt quickly when instructions or tools change." },
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
