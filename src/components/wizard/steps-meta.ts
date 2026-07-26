export interface StepMeta {
  key: string;
  label: string; // short label for the progress rail
  title: string; // full title in the card header
  description: string;
  optional?: boolean;
}

export const STEPS: StepMeta[] = [
  {
    key: "account",
    label: "Account",
    title: "Create Account",
    description: "Set up your login and tell us where you're applying from.",
  },
  {
    key: "personal",
    label: "Personal",
    title: "Personal Information",
    description: "Your personal and identification details.",
  },
  {
    key: "skills",
    label: "Skills",
    title: "Skills & Experience",
    description: "Tell us about your background and expertise.",
  },
  {
    key: "equipment",
    label: "Equipment",
    title: "Equipment & Internet",
    description: "The tools and connectivity you'll work with.",
  },
  {
    key: "assessment",
    label: "Assessment",
    title: "Skills Assessment",
    description: "A short assessment of your core competencies.",
  },
  {
    key: "documents",
    label: "Documents",
    title: "Document Upload",
    description: "Upload your ID, CV, certificates and more.",
  },
  {
    key: "availability",
    label: "Availability",
    title: "Availability",
    description: "When and how much you can work.",
  },
  {
    key: "emergency",
    label: "Emergency",
    title: "Emergency Contact",
    description: "Someone we can reach in case of emergency.",
    optional: true,
  },
  {
    key: "references",
    label: "References",
    title: "References",
    description: "Professional references who can vouch for you.",
    optional: true,
  },
  {
    key: "review",
    label: "Review",
    title: "Review Your Application",
    description: "Check everything before you submit.",
  },
  {
    key: "submit",
    label: "Submit",
    title: "Submit & Pay",
    description: "Finalize your application and pay the fee.",
  },
];

export const TOTAL_STEPS = STEPS.length;
