'use client';

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Brain, Code, FlaskConical, Cog, Send, Zap, Info } from "lucide-react";

import ChatTutor from "@/components/tutor/ChatTutor";
import FlowchartCanvas from "@/components/tutor/FlowchartCanvas";
import FlashcardViewer from "@/components/tutor/FlashcardViewer";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch } from "@/lib/api";

const SUBJECTS: Record<string, { title: string; description: string; icon: any }> = {
  ai: {
    title: "Artificial Intelligence",
    description: "Concepts, machine learning, and exam prep.",
    icon: Brain,
  },
  chemistry: {
    title: "Chemistry",
    description: "Atomic structure, thermodynamics, and more.",
    icon: FlaskConical,
  },
  mechanical: {
    title: "Mechanical Engineering",
    description: "Statics, dynamics, and thermal systems.",
    icon: Cog,
  },
  programming: {
    title: "Python Programming",
    description: "Data types, logic, and practice sets.",
    icon: Code,
  },
};

const SUBJECT_MAP: Record<string, string> = {
  ai: "artificial-intelligence",
  chemistry: "chemistry",
  mechanical: "mechanical",
  programming: "python",
};

const SUBJECT_UNITS: Record<string, string[]> = {
  ai: ["1", "2", "3", "4"],
  chemistry: ["1", "2", "3", "4", "5"],
  mechanical: ["1", "2", "3", "4", "5"],
  programming: ["1", "2", "3", "4", "5"],
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface TutorPageProps {
  params: Promise<{ subject: string }>;
}

export default function TutorPage({ params }: TutorPageProps) {
  const resolvedParams = use(params);
  const subject = resolvedParams.subject;
  const router = useRouter();

  const subjectData = SUBJECTS[subject];
  const backendSubject = SUBJECT_MAP[subject];

  const [activeTab, setActiveTab] = useState<string>("chat");
  const [unit, setUnit] = useState(SUBJECT_UNITS[subject]?.[0] ?? "1");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      router.push("/signup");
      return;
    }

    apiFetch(`/access/subjects?user_id=${userId}`)
      .then((data) => {
        if (data.allowed === false) {
          router.push("/payment");
        } else {
          setAuthorized(true);
        }
      })
      .catch((err) => {
        console.error("Access check error:", err);
        // Fallback or retry logic
      });
  }, [router]);

  useEffect(() => {
    if (!subjectData || !backendSubject) {
      router.push("/subjects");
    }
  }, [subjectData, backendSubject, router]);

  async function handleSend(message: string) {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    try {
      const data = await apiFetch("/ai/tutor", {
        method: "POST",
        body: JSON.stringify({
          user_id: Number(localStorage.getItem("user_id")),
          subject: backendSubject,
          unit,
          topic: `Unit ${unit}`,
          mode: "chat",
          message,
        }),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "I'm sorry, I couldn't process that response.",
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting to the brain center. Please check your connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!authorized || !subjectData || !backendSubject) {
    return (
      <div className="dark min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse font-bold tracking-widest uppercase text-xs">Synchronizing Neural Links...</p>
      </div>
    );
  }

  const Icon = subjectData.icon;

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Background glow beam */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-b border-white/[0.08] bg-[#12121a]/50 backdrop-blur-xl flex items-center justify-between px-8 z-30">
          <div className="flex items-center gap-6">
            <Link href="/subjects" className="p-2 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 group">
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-white" />
            </Link>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">{subjectData.title}</h1>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Learning Session</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Unit Selector */}
            <div className="flex items-center gap-3 bg-black/40 border border-white/[0.08] rounded-xl px-4 py-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Syllabus Node</label>
                <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="bg-transparent text-sm font-bold text-primary focus:outline-none cursor-pointer"
                >
                    {SUBJECT_UNITS[subject]?.map((u) => (
                    <option key={u} value={u} className="bg-[#12121a] text-white">
                        Unit {u}
                    </option>
                    ))}
                </select>
            </div>

            <div className="h-8 w-px bg-white/10 hidden lg:block" />

            <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-[0.2em] border border-white/[0.05] bg-white/[0.02] px-4 py-2 rounded-xl">
                 <Zap className="w-3 h-3 text-primary" />
                 Low Latency Link
            </div>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-8 bg-[#12121a]/30 border-b border-white/[0.05]">
                <TabsList className="bg-transparent h-14 w-full justify-start gap-8">
                    <TabsTrigger value="chat" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-white font-bold text-gray-500 transition-all uppercase text-[11px] tracking-widest">
                        Neural Chat
                    </TabsTrigger>
                    <TabsTrigger value="flowcharts" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-white font-bold text-gray-500 transition-all uppercase text-[11px] tracking-widest">
                        Visual Map
                    </TabsTrigger>
                    <TabsTrigger value="flashcards" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-white font-bold text-gray-500 transition-all uppercase text-[11px] tracking-widest">
                        Memory Cards
                    </TabsTrigger>
                </TabsList>
            </div>

            <div className="flex-1 relative">
                <TabsContent value="chat" className="absolute inset-0 m-0 border-0">
                    <ChatTutor
                        subjectName={subjectData.title}
                        messages={messages}
                        loading={loading}
                        onSend={handleSend}
                    />
                </TabsContent>

                <TabsContent value="flowcharts" className="absolute inset-0 m-0 border-0">
                    <FlowchartCanvas />
                </TabsContent>

                <TabsContent value="flashcards" className="absolute inset-0 m-0 border-0">
                    <FlashcardViewer />
                </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* Right Intelligence Sidebar */}
      <aside className="hidden xl:flex w-80 border-l border-white/[0.08] bg-[#12121a]/80 backdrop-blur-2xl flex-col shadow-2xl z-40">
        <div className="p-6 border-b border-white/[0.08]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-1">Session Intelligence</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Real-time Insights</p>
        </div>
        
        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
            {/* Subject Info */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
                    <Info className="w-4 h-4 text-primary" />
                    Focus Area
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                    <h3 className="font-bold text-white mb-2">{subjectData.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed italic">
                        &quot;{subjectData.description}&quot;
                    </p>
                </div>
            </div>

            {/* Progress Card */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Course Progress</span>
                    <span className="text-[10px] font-bold text-primary">24%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[24%] bg-primary" />
                </div>
            </div>

            {/* AI Assistant Info */}
            <div className="p-5 rounded-[2rem] bg-gradient-to-br from-[#1b1b2a] to-[#12121a] border border-primary/20 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Brain className="w-16 h-16 text-primary" />
                </div>
                <h4 className="text-white font-bold mb-2">Neural Tutor v0.8</h4>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    Personalized learning model optimized for {subjectData.title} exams.
                </p>
                <div className="space-y-3">
                    <div className="flex gap-3 items-center text-[10px] font-bold text-gray-400">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        Adaptive Responses
                    </div>
                    <div className="flex gap-3 items-center text-[10px] font-bold text-gray-400">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        Visual Synthesis
                    </div>
                </div>
            </div>
        </div>
        
        <div className="p-6 border-t border-white/[0.08] text-center">
             <Link href="/subjects" className="text-[10px] font-bold text-gray-600 hover:text-white transition-colors uppercase tracking-[0.3em]">
                Switch Module
             </Link>
        </div>
      </aside>
    </div>
  );
}
