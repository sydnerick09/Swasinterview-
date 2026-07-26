"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LinkButton } from "@/components/ui/Button";

const NAV = [
  { href: "/#benefits", label: "Benefits" },
  { href: "/#process", label: "Process" },
  { href: "/#faq", label: "FAQ" },
  { href: "/status", label: "Check Status" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition hover:text-brand-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LinkButton href="/apply" size="sm" className="hidden sm:inline-flex">
            Apply Now
          </LinkButton>
          {/* Hamburger (mobile/tablet) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text)] transition hover:text-brand-600 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--card)] lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
            <LinkButton href="/apply" size="md" className="mt-2" onClick={() => setOpen(false)}>
              Apply Now
            </LinkButton>
          </nav>
        </div>
      )}
    </header>
  );
}
