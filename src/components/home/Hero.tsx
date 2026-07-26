import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800">
      {/* decorative pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <div className="container-page relative py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/25">
            <Clock className="h-3.5 w-3.5" /> Recruitment window is now open
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Join the SWASTASK global workforce
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            SWASTASK connects skilled remote professionals with meaningful digital tasks. Complete
            a short application, showcase your skills, and start earning from anywhere in the world.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/apply">
              <Button size="lg" className="w-full bg-white text-brand-700 hover:bg-brand-50 sm:w-auto">
                Apply Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/status">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/40 bg-transparent text-white hover:bg-white/10 sm:w-auto"
              >
                Check Application Status
              </Button>
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/70">
            <ShieldCheck className="h-4 w-4" /> Your progress is saved automatically as you go.
          </div>

          {/* Countdown */}
          <div className="mt-12">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-white/70">
              Applications close in
            </p>
            <CountdownTimer />
          </div>
        </div>
      </div>
    </section>
  );
}
