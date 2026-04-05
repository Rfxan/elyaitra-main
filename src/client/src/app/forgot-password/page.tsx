'use client';

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    // UI only - mock reset link sent
  };

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-32 h-1/2 bg-gradient-to-b from-primary via-primary/30 to-transparent blur-[100px] opacity-40 pointer-events-none" />

      {/* Back to login */}
      <Link
        href="/login"
        className="fixed top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-white transition-colors z-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold text-white">
              Elyai<span className="text-primary">tra</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#12121a] border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                <p className="text-muted-foreground">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white px-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#0a0a0f] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all active:scale-[0.98] shadow-xl shadow-primary/20"
                >
                  <Send className="w-5 h-5" />
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
              <p className="text-muted-foreground mb-8">
                We've sent a password reset link to <span className="text-white font-medium">{email}</span>. Please check your inbox and spam folder.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-primary font-bold hover:underline"
              >
                Try a different email
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-white/[0.05] text-center">
             <Link href="/login" className="text-sm text-muted-foreground hover:text-white transition-colors">
                Back to Sign In
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
