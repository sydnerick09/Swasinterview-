import { UserPlus, ClipboardList, Upload, CreditCard, MailCheck } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "Create your account",
    text: "Register with your details and select your country to see your application fee.",
  },
  {
    icon: ClipboardList,
    title: "Complete the application",
    text: "Fill in personal info, skills, equipment and a short skills assessment.",
  },
  {
    icon: Upload,
    title: "Upload your documents",
    text: "Add your ID, CV and certificates. Everything autosaves as you progress.",
  },
  {
    icon: CreditCard,
    title: "Submit & pay the fee",
    text: "Review, submit and complete the country-based application fee securely.",
  },
  {
    icon: MailCheck,
    title: "Get reviewed",
    text: "Our team reviews your documents and contacts you by email with the outcome.",
  },
];

export function Process() {
  return (
    <section
      id="process"
      className="scroll-mt-20 border-y border-[var(--border)] bg-[var(--card)] py-16 sm:py-20"
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">The application process</h2>
          <p className="mt-3 text-muted">Five simple steps from sign-up to review.</p>
        </div>

        <ol className="mt-12 grid gap-8 md:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative flex flex-col items-center text-center">
              {i < STEPS.length - 1 && (
                <span className="absolute left-1/2 top-7 hidden h-px w-full bg-[var(--border)] md:block" />
              )}
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-md">
                <s.icon className="h-6 w-6" />
              </div>
              <span className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-600">
                Step {i + 1}
              </span>
              <h3 className="mt-1 text-sm font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-xs text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
