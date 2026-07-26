import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

/** Shared layout for the Terms & Conditions and Privacy Policy pages. */
export function LegalPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-[70vh]">
        <div className="container-page max-w-3xl py-12 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
          <p className="mt-4 leading-relaxed text-muted">{intro}</p>
          <div className="mt-10 space-y-8">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="scroll-mt-20">
      <h2 className="text-lg font-semibold">
        {n}. {title}
      </h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

/** Bulleted list helper for legal content. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="ml-5 list-disc space-y-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
