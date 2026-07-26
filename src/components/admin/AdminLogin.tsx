"use client";

import { useState } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { adminLogin } from "@/lib/admin-session";

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      setError("");
      onSuccess();
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardBody>
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-xl font-bold">Admin Access</h1>
            <p className="mt-1 text-sm text-muted">
              Enter the administrator password to continue.
            </p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              placeholder="••••••••"
              autoFocus
            />
            <Button type="submit" className="w-full" size="lg">
              Sign in
            </Button>
          </form>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Demo gate only. Default password is <code className="font-mono">swastask-admin</code>{" "}
              (change it in Settings). Replace with real authentication for production.
            </span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
