"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#benefits", label: "Benefits" },
  { href: "/#process", label: "Process" },
  { href: "/#faq", label: "FAQ" },
  { href: "/status", label: "Check Status" },
];

export function Header() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {!isAdmin &&
            NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-muted transition hover:text-brand-600",
                )}
              >
                {item.label}
              </Link>
            ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAdmin ? (
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Site
              </Button>
            </Link>
          ) : (
            <Link href="/apply">
              <Button size="sm">Apply Now</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
