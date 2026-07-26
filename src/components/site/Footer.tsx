import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--card)]">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted">
            SWASTASK connects skilled remote workers with meaningful digital tasks. Apply to join
            our global workforce of professionals.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Portal</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <Link href="/apply" className="hover:text-brand-600">
                Apply Now
              </Link>
            </li>
            <li>
              <Link href="/status" className="hover:text-brand-600">
                Check Status
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-brand-600">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <Link href="/#benefits" className="hover:text-brand-600">
                Why SWASTASK
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-brand-600">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-5">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} SWASTASK. All rights reserved.</p>
          <p>Applications are reviewed and communicated by email.</p>
        </div>
      </div>
    </footer>
  );
}
