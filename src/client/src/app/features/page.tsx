'use client';

import { ArrowLeft, Zap, Shield, Target, Cpu } from "lucide-react";
import Link from "next/link";
import GetStartedButton from "@/components/GetStartedButton";

const featuresData = [
  {
    number: "01",
    subtitle: "INTELLIGENT CONVERSATIONS",
    title: "AI Chat",
    accent: "Instant Clarity",
    description:
      "Get immediate answers to your questions with our advanced AI chat. Whether you're stuck on a complex concept or need quick clarification, ELYAITRA's AI assistant provides detailed, contextual explanations tailored to your learning level.",
    mockup: "/assets/ai-chat-mockup.png",
  },
  {
    number: "02",
    subtitle: "VISUAL LEARNING",
    title: "Smart Flowcharts",
    accent: "See the Path",
    description:
      "Transform complex topics into visual learning paths. Our smart flowcharts break down subjects into digestible steps, showing you exactly how concepts connect and building your understanding systematically.",
    mockup: "/assets/flowchart-mockup.png",
  },
  {
    number: "03",
    subtitle: "MEMORY RETENTION",
    title: "Flashcards",
    accent: "Remember Everything",
    description:
      "Master any subject with AI-optimized flashcards. Our spaced repetition system learns your patterns and presents cards at the perfect intervals for maximum retention, making revision efficient and effective.",
    mockup: "/assets/flashcards-mockup.png",
  },
  {
    number: "04",
    subtitle: "EXAM PREPARATION",
    title: "Smart Quizzes",
    accent: "Test Your Knowledge",
    description:
      "Practice with intelligent quizzes that adapt to your performance. Get instant feedback, identify weak areas, and track your progress with detailed analytics that help you focus on what matters most.",
    mockup: "/assets/quiz-mockup.png",
  },
];

export default function FeaturesPage() {
  return (
    <div className="dark min-h-screen bg-[#0a0a0f] text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Navigation Background */}
      <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0a0f] to-transparent z-40 pointer-events-none" />

      {/* Back link */}
      <Link
        href="/"
        className="fixed top-8 left-8 z-50 flex items-center gap-3 text-gray-500 hover:text-white transition-all group"
      >
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold uppercase tracking-widest">Back to Hub</span>
      </Link>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/10 blur-[150px] -z-10 opacity-60" />
        
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Zap className="w-4 h-4 text-primary fill-primary/20" />
            <span className="text-xs text-primary font-bold uppercase tracking-[0.2em]">Ecosystem Architecture</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-8 tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Augmenting the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-indigo-500 italic">Learning Experience</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Discover the next generation of educational tools. ELYAITRA integrates 
            advanced neural processing with intuitive interfaces to unlock human potential.
          </p>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto space-y-48">
          {featuresData.map((feature, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div
                key={feature.number}
                className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-16 lg:gap-24 items-center`}
              >
                {/* Text Content */}
                <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                  <div className="relative">
                    <span className="text-8xl font-black text-white/[0.03] absolute -top-12 -left-8 select-none">
                        {feature.number}
                    </span>
                    <div className="relative z-10 flex flex-col gap-2">
                        <p className="text-xs font-black text-primary uppercase tracking-[0.3em]">
                        {feature.subtitle}
                        </p>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                        <span className="text-primary italic">{feature.accent}</span> — {feature.title}
                        </h2>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                    {feature.description}
                  </p>
                  
                  <div className="flex gap-6">
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Processing</span>
                        <span className="text-xs font-bold text-white uppercase tracking-widest">Neural Link v4.0</span>
                     </div>
                     <div className="w-px h-8 bg-white/10" />
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Availability</span>
                        <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            Live
                        </span>
                     </div>
                  </div>
                </div>

                {/* Mockup Image Container */}
                <div className="flex-1 w-full max-w-2xl animate-in fade-in slide-in-from-right-8 duration-1000">
                  <div className="relative group">
                    {/* Artistic Glow */}
                    <div className="absolute inset-x-0 inset-y-0 bg-primary/20 blur-[80px] rounded-full scale-90 group-hover:scale-100 transition-transform duration-700 opacity-40" />
                    
                    {/* Device Frame (Abstract) */}
                    <div className="relative border border-white/10 bg-[#12121a] rounded-3xl p-3 shadow-2xl overflow-hidden group-hover:border-primary/30 transition-all duration-500">
                        <div className="absolute top-0 left-0 right-0 h-6 bg-white/[0.02] border-b border-white/[0.05] flex items-center px-4 gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        </div>
                        <img 
                        src={feature.mockup} 
                        alt={feature.title}
                        className="w-full h-auto rounded-2xl relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
                        loading="lazy"
                        />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-8 tracking-tighter">
            Initiate Your <span className="text-primary italic">Transformation</span>
          </h2>
          <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            The neural network is ready. Join thousands of students who have already 
            optimized their learning process with ELYAITRA.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <GetStartedButton />
            <Link 
                href="/login" 
                className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-[0.4em] transition-all"
            >
                Returning Member Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-white/[0.05] text-center">
        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.5em]">
            Elyaitra Core Operations • Global Node 01
        </p>
      </footer>
    </div>
  );
}
