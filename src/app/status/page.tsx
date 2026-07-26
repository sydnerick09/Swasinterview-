"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardBody } from "@/components/ui/Card";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export default function StatusLookupPage() {
  const router = useRouter();
  const [id, setId] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim()) router.push(`/status/${encodeURIComponent(id.trim())}`);
  };

  return (
    <>
      <Header />
      <main className="min-h-[70vh]">
        <div className="container-page max-w-lg py-16">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
              <Search className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-bold">Check your application status</h1>
            <p className="mt-2 text-muted">
              Enter the Application ID you received when you submitted your application.
            </p>
          </div>

          <Card className="mt-8">
            <CardBody>
              <form onSubmit={submit} className="space-y-4">
                <TextField
                  label="Application ID"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter your Application ID"
                  autoFocus
                />
                <Button type="submit" className="w-full" size="lg">
                  <Search className="h-4 w-4" /> Look up application
                </Button>
              </form>
              <p className="mt-4 text-center text-xs text-muted">
                Note: applications are stored in the browser used to apply.
              </p>
            </CardBody>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
