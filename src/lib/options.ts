// Reusable dropdown option sets for the application wizard.

const opt = (v: string) => ({ value: v, label: v });

export const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export const EDUCATION_LEVELS = [
  "High School",
  "Certificate",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate (PhD)",
  "Other",
].map(opt);

export const EMPLOYMENT_STATUS = [
  "Employed full-time",
  "Employed part-time",
  "Self-employed / Freelancer",
  "Student",
  "Unemployed",
  "Other",
].map(opt);

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
].map(opt);

export const SKILL_CATEGORIES = [
  "Data Entry",
  "Content Writing / Copywriting",
  "Transcription",
  "Translation",
  "Customer Support",
  "Virtual Assistance",
  "Research",
  "Graphic Design",
  "Software Development",
  "Data Annotation / Labeling",
  "Digital Marketing",
  "Other",
].map(opt);

export const SKILL_SUGGESTIONS = [
  "Data Entry",
  "Microsoft Excel",
  "Microsoft Word",
  "Google Workspace",
  "Copywriting",
  "Proofreading",
  "Transcription",
  "Translation",
  "Customer Service",
  "Research",
  "Typing",
  "Data Annotation",
  "SEO",
  "Social Media",
];

export const LANGUAGE_SUGGESTIONS = [
  "English",
  "Swahili",
  "French",
  "Arabic",
  "Spanish",
  "Portuguese",
  "Mandarin",
  "Hindi",
];

export const YEARS_OF_EXPERIENCE = [
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "6–10 years",
  "More than 10 years",
].map(opt);

export const PROFICIENCY = [
  { value: "none", label: "None" },
  { value: "basic", label: "Basic" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

export const DEVICE_TYPES = ["Laptop", "Desktop", "Tablet", "Smartphone"].map(opt);
export const OPERATING_SYSTEMS = ["Windows", "macOS", "Linux", "ChromeOS", "Android", "iOS"].map(opt);
export const RAM_OPTIONS = ["2 GB", "4 GB", "8 GB", "16 GB", "32 GB or more"].map(opt);
export const INTERNET_TYPES = ["Fiber", "Broadband / DSL", "Mobile Data (4G/5G)", "Satellite", "Other"].map(opt);
export const INTERNET_SPEEDS = [
  "Less than 5 Mbps",
  "5–10 Mbps",
  "10–25 Mbps",
  "25–50 Mbps",
  "50–100 Mbps",
  "More than 100 Mbps",
].map(opt);

export const HOURS_PER_WEEK = [
  "Less than 10 hours",
  "10–20 hours",
  "20–30 hours",
  "30–40 hours",
  "40+ hours",
].map(opt);

export const SHIFTS = ["Morning", "Afternoon", "Evening", "Night", "Flexible / Any"].map(opt);

export const NOTICE_PERIODS = [
  "Immediately",
  "Within 1 week",
  "Within 2 weeks",
  "Within 1 month",
  "More than 1 month",
].map(opt);

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const TIMEZONES = [
  "GMT (UTC+0)",
  "West Africa (UTC+1)",
  "Central Africa (UTC+2)",
  "East Africa (UTC+3)",
  "Gulf (UTC+4)",
  "India (UTC+5:30)",
  "China / Singapore (UTC+8)",
  "US Eastern (UTC-5)",
  "US Pacific (UTC-8)",
  "UK (UTC+0/+1)",
  "Central Europe (UTC+1)",
  "Australia Eastern (UTC+10)",
  "Other",
].map(opt);

export const RELATIONSHIPS = [
  "Parent",
  "Sibling",
  "Spouse",
  "Friend",
  "Colleague",
  "Other",
].map(opt);
