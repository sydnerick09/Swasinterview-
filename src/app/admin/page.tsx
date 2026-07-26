"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { Dashboard } from "@/components/admin/Dashboard";
import { isAdminAuthed, adminLogout } from "@/lib/admin-session";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(isAdminAuthed());
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-[70vh]">
        {authed === null ? null : authed ? (
          <Dashboard
            onLogout={() => {
              adminLogout();
              setAuthed(false);
            }}
          />
        ) : (
          <AdminLogin onSuccess={() => setAuthed(true)} />
        )}
      </main>
      <Footer />
    </>
  );
}
