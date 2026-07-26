"use client";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WizardProvider } from "@/components/wizard/WizardContext";
import { Wizard } from "@/components/wizard/Wizard";
import { ClosedMessage } from "@/components/wizard/ClosedMessage";
import { FormSkeleton } from "@/components/ui/Skeleton";
import { useApplicationWindow } from "@/hooks/useApplicationWindow";

export default function ApplyPage() {
  const { ready, window: win, settings } = useApplicationWindow();

  return (
    <>
      <Header />
      <main className="min-h-[70vh]">
        {!ready ? (
          <div className="container-page py-8">
            <FormSkeleton />
          </div>
        ) : !win.hasStarted ? (
          <ClosedMessage variant="not-started" opensAt={new Date(settings.openDate)} />
        ) : !win.open ? (
          <ClosedMessage variant="closed" />
        ) : (
          <WizardProvider>
            <Wizard />
          </WizardProvider>
        )}
      </main>
      <Footer />
    </>
  );
}
