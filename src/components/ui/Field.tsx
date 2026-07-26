"use client";

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { AlertCircle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

function ErrorText({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
      <AlertCircle className="h-3.5 w-3.5" /> {error}
    </p>
  );
}

interface BaseFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

// ---------- Text input ----------
interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement>, BaseFieldProps {}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, required, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={!!error}
        className={cn("input-base", error && "border-red-500 focus:ring-red-200")}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      <ErrorText error={error} />
    </div>
  );
});

// ---------- Textarea ----------
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseFieldProps {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, hint, required, className, id, rows = 4, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={!!error}
        className={cn("input-base resize-y", error && "border-red-500 focus:ring-red-200")}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      <ErrorText error={error} />
    </div>
  );
});

// ---------- Select ----------
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseFieldProps {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, hint, required, className, id, options, placeholder, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}
      <select
        ref={ref}
        id={fieldId}
        aria-invalid={!!error}
        className={cn("input-base cursor-pointer", error && "border-red-500 focus:ring-red-200")}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      <ErrorText error={error} />
    </div>
  );
});

// ---------- Checkbox ----------
export function CheckboxField({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--border)] p-3 transition hover:border-brand-300 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 dark:has-[:checked]:bg-brand-950/40">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
      />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && <span className="block text-xs text-muted">{description}</span>}
      </span>
    </label>
  );
}

// ---------- Radio cards ----------
export function RadioCards({
  label,
  value,
  onChange,
  options,
  error,
  required,
  columns = 2,
}: BaseFieldProps & {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; description?: string }[];
  columns?: number;
}) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        role="radiogroup"
      >
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "rounded-lg border p-3 text-left text-sm transition",
                active
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-950/40"
                  : "border-[var(--border)] hover:border-brand-300",
              )}
            >
              <span className="flex items-center justify-between font-medium">
                {o.label}
                {active && <Check className="h-4 w-4 text-brand-600" />}
              </span>
              {o.description && <span className="text-xs text-muted">{o.description}</span>}
            </button>
          );
        })}
      </div>
      <ErrorText error={error} />
    </div>
  );
}

// ---------- Tag input (skills, languages) ----------
export function TagInput({
  label,
  values,
  onChange,
  placeholder,
  error,
  required,
  suggestions = [],
}: BaseFieldProps & {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [input, setInput] = useState("");

  const add = (raw: string) => {
    const v = raw.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput("");
  };
  const remove = (v: string) => onChange(values.filter((x) => x !== v));

  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <div
        className={cn(
          "input-base flex min-h-[46px] flex-wrap items-center gap-1.5 py-2",
          error && "border-red-500",
        )}
      >
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-md bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900 dark:text-brand-200"
          >
            {v}
            <button type="button" onClick={() => remove(v)} aria-label={`Remove ${v}`}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(input);
            } else if (e.key === "Backspace" && !input && values.length) {
              remove(values[values.length - 1]);
            }
          }}
          placeholder={values.length ? "" : placeholder}
          className="min-w-[120px] flex-1 bg-transparent text-sm outline-none"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions
            .filter((s) => !values.includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="rounded-md border border-dashed border-[var(--border)] px-2 py-0.5 text-xs text-muted transition hover:border-brand-400 hover:text-brand-600"
              >
                + {s}
              </button>
            ))}
        </div>
      )}
      <ErrorText error={error} />
    </div>
  );
}
