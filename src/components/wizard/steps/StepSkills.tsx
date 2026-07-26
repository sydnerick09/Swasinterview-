"use client";

import { useWizard } from "../WizardContext";
import { TextField, TextArea, SelectField, TagInput } from "@/components/ui/Field";
import {
  EDUCATION_LEVELS,
  EMPLOYMENT_STATUS,
  SKILL_CATEGORIES,
  SKILL_SUGGESTIONS,
  LANGUAGE_SUGGESTIONS,
  YEARS_OF_EXPERIENCE,
  PROFICIENCY,
} from "@/lib/options";
import type { ProficiencyLevel } from "@/lib/types";

export function StepSkills() {
  const { app, patchSection, errors } = useWizard();
  const s = app.skills;

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SelectField
        label="Highest Education Level"
        required
        placeholder="Select level"
        options={EDUCATION_LEVELS}
        value={s.educationLevel}
        onChange={(e) => patchSection("skills", { educationLevel: e.target.value })}
        error={errors.educationLevel}
      />
      <TextField
        label="Field of Study"
        required
        value={s.fieldOfStudy}
        onChange={(e) => patchSection("skills", { fieldOfStudy: e.target.value })}
        error={errors.fieldOfStudy}
        placeholder="Enter your field of study"
      />
      <SelectField
        label="Years of Experience"
        required
        placeholder="Select experience"
        options={YEARS_OF_EXPERIENCE}
        value={s.yearsOfExperience}
        onChange={(e) => patchSection("skills", { yearsOfExperience: e.target.value })}
        error={errors.yearsOfExperience}
      />
      <SelectField
        label="Employment Status"
        required
        placeholder="Select status"
        options={EMPLOYMENT_STATUS}
        value={s.employmentStatus}
        onChange={(e) => patchSection("skills", { employmentStatus: e.target.value })}
        error={errors.employmentStatus}
      />
      <TextField
        label="Current / Most Recent Job Title"
        value={s.currentJobTitle}
        onChange={(e) => patchSection("skills", { currentJobTitle: e.target.value })}
        placeholder="Enter your current or most recent job title"
      />
      <TextField
        label="Current / Most Recent Employer"
        value={s.currentEmployer}
        onChange={(e) => patchSection("skills", { currentEmployer: e.target.value })}
        placeholder="Enter your employer"
      />
      <SelectField
        label="Primary Skill Category"
        required
        placeholder="Select category"
        options={SKILL_CATEGORIES}
        value={s.primarySkillCategory}
        onChange={(e) => patchSection("skills", { primarySkillCategory: e.target.value })}
        error={errors.primarySkillCategory}
      />
      <SelectField
        label="English Proficiency"
        required
        placeholder="Select proficiency"
        options={PROFICIENCY}
        value={s.englishProficiency}
        onChange={(e) =>
          patchSection("skills", { englishProficiency: e.target.value as ProficiencyLevel })
        }
        error={errors.englishProficiency}
      />

      <div className="sm:col-span-2">
        <TagInput
          label="Skills"
          required
          values={s.skills}
          onChange={(v) => patchSection("skills", { skills: v })}
          placeholder="Type a skill and press Enter"
          suggestions={SKILL_SUGGESTIONS}
          error={errors.skills}
        />
      </div>
      <div className="sm:col-span-2">
        <TagInput
          label="Languages Spoken"
          required
          values={s.languages}
          onChange={(v) => patchSection("skills", { languages: v })}
          placeholder="Type a language and press Enter"
          suggestions={LANGUAGE_SUGGESTIONS}
          error={errors.languages}
        />
      </div>

      <TextField
        label="Portfolio / Website URL"
        value={s.portfolioUrl}
        onChange={(e) => patchSection("skills", { portfolioUrl: e.target.value })}
        error={errors.portfolioUrl}
        placeholder="https://…"
      />
      <TextField
        label="LinkedIn URL"
        value={s.linkedinUrl}
        onChange={(e) => patchSection("skills", { linkedinUrl: e.target.value })}
        error={errors.linkedinUrl}
        placeholder="https://linkedin.com/in/…"
      />
      <TextField
        label="Expected Hourly Rate (USD)"
        required
        type="number"
        min={0}
        value={s.expectedHourlyRate}
        onChange={(e) => patchSection("skills", { expectedHourlyRate: e.target.value })}
        error={errors.expectedHourlyRate}
        placeholder="Enter your expected hourly rate"
      />
      <div />

      <div className="sm:col-span-2">
        <TextArea
          label="Professional Summary"
          required
          rows={5}
          value={s.professionalSummary}
          onChange={(e) => patchSection("skills", { professionalSummary: e.target.value })}
          error={errors.professionalSummary}
          hint="Briefly describe your experience and what makes you a strong candidate (min 20 characters)."
          placeholder="Write a short summary of your experience and strengths"
        />
      </div>
    </div>
  );
}
