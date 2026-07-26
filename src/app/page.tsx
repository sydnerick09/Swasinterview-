import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { Process } from "@/components/home/Process";
import { PricingPreview } from "@/components/home/PricingPreview";
import { Faq } from "@/components/home/Faq";
import { LinkButton } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Process />
        <PricingPreview />
        <Faq />

        {/* Final CTA */}
        <section className="container-page py-16 sm:py-20">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-12 text-center sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to join SWASTASK?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Start your application today. It only takes a few minutes and your progress is saved
              automatically.
            </p>
            <div className="mt-8">
              <LinkButton
                href="/apply"
                size="lg"
                className="bg-white text-brand-700 hover:bg-brand-50"
              >
                Start your application <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
