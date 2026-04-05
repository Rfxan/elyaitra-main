'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Check, ShieldCheck, Zap, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        router.push("/login");
        return;
      }

      try {
        const data = await apiFetch(`/access/subjects?user_id=${userId}`);
        if (data.allowed) {
          router.push("/subjects");
          return;
        }
      } catch (err) {
        console.error("Access verification failed:", err);
      } finally {
        setChecking(false);
      }
    };

    checkPaymentStatus();
  }, [router]);

  const handlePayment = async () => {
    const userId = Number(localStorage.getItem("user_id"));
    const isDev = process.env.NODE_ENV === 'development';

    // DEV MODE BYPASS (as per original logic)
    if (isDev) {
      try {
        setLoading(true);
        await apiFetch("/payments/record", {
          method: "POST",
          body: JSON.stringify({
            user_id: userId,
            amount: 1,
          }),
        });

        router.push("/subjects");
        return;
      } catch (err) {
        setError("Development payment bypass failed.");
        setLoading(false);
        return;
      }
    }

    if (!razorpayReady) {
      setError("Payment gateway is initializing. Please wait a moment.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const order = await apiFetch("/payments/create-order", {
        method: "POST",
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "Elyaitra",
        description: "Full Learning Access Unlock",
        handler: async (response: any) => {
          await apiFetch("/payments/record", {
            method: "POST",
            body: JSON.stringify({
              user_id: userId,
              amount: 1,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          router.push("/subjects");
        },
        theme: {
          color: "#07BAFF",
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("Payment initialization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="dark min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Verifying Credentials...</p>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-[#0a0a0f] text-white selection:bg-primary/30 flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayReady(true)}
      />

      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(7,186,255,0.05)_0%,_transparent_50%)] pointer-events-none" />

      {/* Back link */}
      <Link
        href="/"
        className="fixed top-8 left-8 z-50 flex items-center gap-3 text-gray-500 hover:text-white transition-all group"
      >
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold uppercase tracking-widest">Back</span>
      </Link>

      <div className="relative z-10 w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-[#12121a] border border-white/[0.08] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 group-hover:scale-105 transition-transform duration-500">
                <Zap className="w-3.5 h-3.5 text-primary fill-primary/20" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">One-Time Node Expansion</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tighter">
              Unlock Full <span className="text-primary italic">Access</span>
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
              Initiate a permanent link to all deep-learning subject modules.
            </p>
          </div>

          {/* Pricing Highlight */}
          <div className="bg-black/40 border border-white/[0.05] rounded-3xl p-8 text-center mb-10 relative overflow-hidden group/price">
             <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/price:opacity-100 transition-opacity" />
             <div className="relative z-10">
                <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-2xl font-bold text-gray-500">₹</span>
                    <span className="text-7xl font-black text-white tracking-tighter">1</span>
                </div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Lifetime Authorization</p>
             </div>
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-10 px-2">
            {[
              "AI-Powered Syllabus Navigation",
              "Infinite Neural Chat Sessions",
              "Automated Visual Synthesis",
              "Spaced Repetition Memory Cards",
              "Zero Recurring Charges"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-sm text-gray-400 group/item">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover/item:bg-emerald-500/20 transition-colors">
                    <Check className="w-3 h-3 text-emerald-500" />
                </div>
                <span className="group-hover/item:text-white transition-colors">{feature}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{error}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handlePayment}
            disabled={loading || (!razorpayReady && process.env.NODE_ENV !== 'development')}
            className="w-full flex items-center justify-center gap-3 h-16 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
                <>
                    <ShieldCheck className="w-6 h-6" />
                    PAY & ACTIVATE NODE
                </>
            )}
          </button>

          <div className="mt-8 flex items-center justify-center gap-6 opacity-30 group-hover:opacity-60 transition-opacity duration-700">
             <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-400">Secure AES-256</span>
             <div className="w-1 h-1 rounded-full bg-gray-700" />
             <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-400">RAZORPAY LINK</span>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="text-center text-[10px] font-bold text-gray-700 mt-8 uppercase tracking-[0.3em]">
            By activating, you agree to the Neural Subscription Protocol v.1.2
        </p>
      </div>
    </div>
  );
}
