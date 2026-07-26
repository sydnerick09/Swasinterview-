import {
  Globe2,
  Wallet,
  Clock4,
  GraduationCap,
  Users,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const BENEFITS = [
  {
    icon: Globe2,
    title: "Work from anywhere",
    text: "Fully remote roles. All you need is a reliable device and internet connection.",
  },
  {
    icon: Wallet,
    title: "Competitive pay",
    text: "Transparent task-based earnings paid on a predictable schedule.",
  },
  {
    icon: Clock4,
    title: "Flexible hours",
    text: "Choose shifts that fit your life — part-time or full-time.",
  },
  {
    icon: GraduationCap,
    title: "Skill growth",
    text: "Access training and take on increasingly rewarding, higher-value tasks.",
  },
  {
    icon: Users,
    title: "Global community",
    text: "Collaborate with a diverse workforce across dozens of countries.",
  },
  {
    icon: TrendingUp,
    title: "Career progression",
    text: "Top performers unlock team-lead and reviewer opportunities.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="container-page scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">Why work with SWASTASK</h2>
        <p className="mt-3 text-muted">
          Thousands of professionals choose SWASTASK for flexible, meaningful digital work.
        </p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b) => (
          <Card key={b.title} className="p-6 transition hover:shadow-card-lg">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
              <b.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{b.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
