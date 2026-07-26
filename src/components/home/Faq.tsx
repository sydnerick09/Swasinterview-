"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What is the SWASTASK Application Portal?",
    a: "It is the official recruitment portal for applicants who wish to work on the SWASTASK platform. You complete a multi-step application, upload your documents and pay a one-time, country-based application fee.",
  },
  {
    q: "How is the application fee determined?",
    a: "The fee is calculated automatically based on the country you select when creating your account. It cannot be edited manually and is shown to you before you pay.",
  },
  {
    q: "Is my progress saved if I leave?",
    a: "Yes. Your application autosaves in your browser as you complete each step, so you can return and continue where you left off — as long as you use the same browser.",
  },
  {
    q: "What documents do I need?",
    a: "You can upload your National ID or Passport, CV, academic and professional certificates, portfolio and a cover letter. Accepted formats are PDF, DOC, DOCX, JPG, JPEG and PNG, up to 20 MB each.",
  },
  {
    q: "How long is the application window open?",
    a: "Applications are accepted for a limited recruitment window (four days by default). A live countdown shows the time remaining; once it reaches zero, new applications close automatically.",
  },
  {
    q: "What happens after I submit and pay?",
    a: "Your application is locked and a unique Application ID is generated. Our team reviews your documents and contacts you by email with the outcome. Keep your Application ID to check your status.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-[var(--border)] bg-[var(--card)] py-16 sm:py-20"
    >
      <div className="container-page max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          <p className="mt-3 text-muted">Everything you need to know before you apply.</p>
        </div>

        <div className="mt-10 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)]">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden px-5 text-sm text-muted transition-all",
                    isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">{item.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
