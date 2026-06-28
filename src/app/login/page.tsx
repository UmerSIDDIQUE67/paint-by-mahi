"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Palette, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "login" | "signup" | "forgot";

const USERS_KEY = "pbm_users";
const SESSION_KEY = "pbm_user_session";

interface StoredUser { name: string; email: string; password: string; }

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

import { sendEmail } from "@/lib/email";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password);
    if (user) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
      await sendEmail({ type: "welcome", to: user.email, name: user.name });
      router.push("/");
    } else {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    if (!form.name.trim()) { setError("Name is required."); setLoading(false); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); setLoading(false); return; }
    await new Promise(r => setTimeout(r, 500));
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === form.email.toLowerCase())) {
      setError("An account with this email already exists."); setLoading(false); return;
    }
    saveUsers([...users, { name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password }]);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: form.name.trim(), email: form.email.trim().toLowerCase() }));
    router.push("/");
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setSuccess("If that email exists, a reset link has been sent. Check your inbox.");
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-stone-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-linear-to-br from-amber-700 to-amber-500 flex items-center justify-center shadow-lg">
              <Palette className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-xl text-amber-900">Paint by Mahi</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
          {/* Mode tabs */}
          {mode !== "forgot" && (
            <div className="flex bg-stone-100 rounded-xl p-1 mb-6">
              {(["login","signup"] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode===m?"bg-white shadow text-stone-800":"text-stone-500 hover:text-stone-700"}`}>
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />{success}
            </div>
          )}

          {/* LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address</label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input type="email" value={form.email} onChange={set("email")} className="pl-9" placeholder="you@example.com" required autoFocus />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-stone-700">Password</label>
                  <button type="button" onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }} className="text-xs text-amber-700 hover:underline">Forgot password?</button>
                </div>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input type={showPass?"text":"password"} value={form.password} onChange={set("password")} className="pl-9 pr-10" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          )}

          {/* SIGNUP */}
          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
                <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input value={form.name} onChange={set("name")} className="pl-9" placeholder="Your full name" required autoFocus />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address</label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input type="email" value={form.email} onChange={set("email")} className="pl-9" placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input type={showPass?"text":"password"} value={form.password} onChange={set("password")} className="pl-9 pr-10" placeholder="Min. 6 characters" required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Confirm Password</label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input type={showPass?"text":"password"} value={form.confirm} onChange={set("confirm")} className="pl-9" placeholder="Repeat password" required />
                </div>
              </div>
              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
              <p className="text-xs text-stone-400 text-center">By signing up you agree to our <Link href="/terms" className="underline hover:text-amber-700">Terms</Link> and <Link href="/privacy" className="underline hover:text-amber-700">Privacy Policy</Link>.</p>
            </form>
          )}

          {/* FORGOT */}
          {mode === "forgot" && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="text-center mb-2">
                <h2 className="text-lg font-bold text-stone-800">Reset Password</h2>
                <p className="text-sm text-stone-500 mt-1">Enter your email and we&apos;ll send a reset link.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address</label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input type="email" value={form.email} onChange={set("email")} className="pl-9" placeholder="you@example.com" required autoFocus />
                </div>
              </div>
              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading || !!success}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <button type="button" onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="w-full text-sm text-stone-500 hover:text-amber-700 transition-colors">
                ← Back to Sign In
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-stone-400 mt-6">
          <Link href="/" className="hover:text-amber-700 transition-colors">← Continue browsing without signing in</Link>
        </p>
      </div>
    </div>
  );
}
