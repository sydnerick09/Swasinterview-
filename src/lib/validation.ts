import { z } from "zod";
import type { Application } from "./types";

// Per-step validation schemas. These run client-side for inline feedback and are also
// used to gate step navigation and the final submit (server-grade validation would
// reuse these same schemas behind an API).

const requiredString = (label: string, min = 1) =>
  z.string().trim().min(min, `${label} is required`);

const phoneSchema = z
  .string()
  .trim()
  .min(6, "Enter a valid phone number")
  .regex(/^[+]?[0-9\s()-]{6,20}$/, "Enter a valid phone number");

const emailSchema = z.string().trim().min(1, "Email is required").email("Enter a valid email");

export const accountSchema = z
  .object({
    fullName: requiredString("Full name", 2),
    email: emailSchema,
    phone: phoneSchema,
    country: requiredString("Country"),
    username: requiredString("Username", 3),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const personalSchema = z.object({
  fullName: requiredString("Full name", 2),
  dateOfBirth: requiredString("Date of birth"),
  gender: requiredString("Gender"),
  nationality: requiredString("Nationality"),
  country: requiredString("Country"),
  countyState: requiredString("County/State"),
  city: requiredString("City"),
  idOrPassportNumber: requiredString("National ID or Passport number"),
  phone: phoneSchema,
  email: emailSchema,
});

export const skillsSchema = z.object({
  educationLevel: requiredString("Education level"),
  fieldOfStudy: requiredString("Field of study"),
  yearsOfExperience: requiredString("Years of experience"),
  currentJobTitle: z.string().trim().optional().default(""),
  currentEmployer: z.string().trim().optional().default(""),
  employmentStatus: requiredString("Employment status"),
  primarySkillCategory: requiredString("Primary skill category"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  languages: z.array(z.string()).min(1, "Add at least one language"),
  englishProficiency: requiredString("English proficiency"),
  professionalSummary: requiredString("Professional summary", 20),
  portfolioUrl: z.string().trim().url("Enter a valid URL").or(z.literal("")).optional(),
  linkedinUrl: z.string().trim().url("Enter a valid URL").or(z.literal("")).optional(),
  expectedHourlyRate: requiredString("Expected hourly rate"),
});

export const equipmentSchema = z.object({
  deviceType: requiredString("Device type"),
  operatingSystem: requiredString("Operating system"),
  ram: requiredString("RAM"),
  processor: requiredString("Processor"),
  internetType: requiredString("Internet type"),
  internetSpeed: requiredString("Internet speed"),
});

export const availabilitySchema = z.object({
  availableFrom: requiredString("Available from date"),
  hoursPerWeek: requiredString("Hours per week"),
  preferredShift: requiredString("Preferred shift"),
  timezone: requiredString("Timezone"),
  daysAvailable: z.array(z.string()).min(1, "Select at least one day"),
  noticePeriod: requiredString("Notice period"),
  employmentType: requiredString("Employment type"),
});

export type ValidationResult = { ok: true } | { ok: false; errors: Record<string, string> };

function toResult(parsed: z.SafeParseReturnType<unknown, unknown>): ValidationResult {
  if (parsed.success) return { ok: true };
  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path.join(".");
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}

/** Validate a given step index against the current application. Returns field errors. */
export function validateStep(step: number, app: Application): ValidationResult {
  switch (step) {
    case 0:
      return toResult(
        accountSchema.safeParse({
          ...app.account,
          confirmPassword: app.account.password, // confirm handled in-form; stored value is the confirmed one
        }),
      );
    case 1:
      return toResult(personalSchema.safeParse(app.personal));
    case 2:
      return toResult(skillsSchema.safeParse(app.skills));
    case 3:
      return toResult(equipmentSchema.safeParse(app.equipment));
    case 4:
      // Assessment: require the typing test to be completed and all scored MCQs answered
      return app.assessment.typing.completed
        ? { ok: true }
        : { ok: false, errors: { typing: "Please complete the typing test" } };
    case 5:
      return { ok: true }; // documents optional to advance, but recommended
    case 6:
      return toResult(availabilitySchema.safeParse(app.availability));
    case 7:
      return { ok: true }; // emergency contact optional
    case 8:
      return { ok: true }; // references optional
    default:
      return { ok: true };
  }
}
