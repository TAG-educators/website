"use client";

import { useState } from "react";
import { useAuth } from "@/components/admin/AuthProvider";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (error) setError(error);
  };

  return (
    <div className="admin-scope min-h-screen flex items-center justify-center bg-bg-subtle px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-6 justify-center">
          <img
            src="/logo.png"
            alt="TAG Educators"
            className="w-9 h-9 rounded-[6px] object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] font-semibold text-ink">TAG Admin</span>
            <span className="text-[10px] text-ink-faint">Ark Global Educators</span>
          </div>
        </div>

        <div className="bg-white rounded-[10px] border border-border p-6 shadow-sm">
          <h1 className="text-[16px] font-semibold text-ink mb-1">Sign in</h1>
          <p className="text-[12px] text-ink-faint mb-5">Use your admin credentials to continue.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tag.edu"
                className="w-full h-9 px-3 rounded-[6px] border border-border bg-white text-[13px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink-soft mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-9 px-3 rounded-[6px] border border-border bg-white text-[13px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>

            {error && (
              <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-9 rounded-[6px] bg-accent text-white text-[13px] font-medium hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-ink-faint mt-4">
          TAG Educators Admin · Authorized access only
        </p>
      </div>
    </div>
  );
}