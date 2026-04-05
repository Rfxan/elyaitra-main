'use client';

import { useEffect, useState } from "react";
import { ArrowLeft, Brain, Code, FlaskConical, Cog, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

const subjects = [
  {
    id: "ai",
    title: "AI",
    description: "Master machine learning, neural networks, and AI fundamentals.",
    icon: Brain,
  },
  {
    id: "programming",
    title: "Python Programming",
    description: "Build strong programming and problem-solving skills.",
    icon: Code,
  },
  {
    id: "chemistry",
    title: "Chemistry",
    description: "Organic, inorganic, and physical chemistry explained clearly.",
    icon: FlaskConical,
  },
  {
    id: "mechanical",
    title: "Mechanical",
    description: "Mechanics, thermodynamics, and engineering principles.",
    icon: Cog,
  },
];

export default function SubjectsPage() {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        router.push("/signup");
        return;
      }

      try {
        const data = await apiFetch(`/access/subjects?user_id=${userId}`);
        setHasAccess(Boolean(data.allowed));
      } catch (err) {
        console.error("Access check failed:", err);
        setHasAccess(false);
      }
    };

    checkAccess();
  }, [router]);

  const handleSubjectClick = (id: string) => {
    if (hasAccess === false) {
      router.push("/payment");
      return;
    }
    router.push(`/tutor/${id}`);
  };

  if (hasAccess === null) {
    return (
      <div className="dark min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading subjects...</p>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-[#0a0a0f] text-white selection:bg-primary/30">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Back button */}
      <Link
        href="/"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-gray-500 hover:text-white transition-all group"
      >
        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Learning Path</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
            Choose Your <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary">Subject</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            Select a specialized track to begin your AI-powered learning journey. 
            Our tutors adapt to your unique pace and style.
          </p>
        </header>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <div
                key={subject.id}
                className="group relative"
              >
                {/* Subject Card */}
                <button
                  onClick={() => handleSubjectClick(subject.id)}
                  className="w-full text-left p-8 rounded-3xl border border-white/[0.08] bg-[#12121a] hover:bg-[#181824] hover:border-primary/50 transition-all duration-300 shadow-2xl relative overflow-hidden"
                >
                  {/* Lock Overlay for non-premium */}
                  {hasAccess === false && (
                    <div className="absolute inset-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                        <Lock className="w-6 h-6 text-white/50" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Premium Subject</h3>
                      <p className="text-sm text-gray-400 mb-6">Upgrade your account to unlock this learning path.</p>
                      <Link 
                        href="/payment"
                        className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Unlock Now
                      </Link>
                    </div>
                  )}

                  <div className={`flex gap-6 items-start transition-all duration-500 ${hasAccess === false ? 'blur-sm grayscale scale-95 opacity-50' : ''}`}>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                        {subject.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {subject.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-white/[0.05] flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-600">
        <p>© 2025 ELYAITRA PLATFORM</p>
        <div className="flex gap-8">
            <span>Support</span>
            <span>Policy</span>
        </div>
      </footer>
    </div>
  );
}
