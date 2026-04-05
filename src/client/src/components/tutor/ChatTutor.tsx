'use client';

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Brain,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatTutorProps {
  subjectName: string;
  messages: ChatMessage[];
  loading: boolean;
  onSend: (message: string) => Promise<void>;
}

const suggestedPrompts = [
  { icon: BookOpen, text: "Explain this concept in simple terms" },
  { icon: Brain, text: "Give me practice questions" },
  { icon: Lightbulb, text: "What are the key takeaways?" },
  { icon: Sparkles, text: "Create a study guide" },
];

export default function ChatTutor({
  subjectName,
  messages,
  loading,
  onSend,
}: ChatTutorProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    await onSend(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePromptClick = (text: string) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]">
      {/* Header */}
      <div className="p-5 border-b border-white/[0.08] bg-[#12121a]/50 backdrop-blur-md flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-white">{subjectName} AI Tutor</h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
            Interactive Learning Mode
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="max-w-4xl mx-auto py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[450px] text-center">
              <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-6 border border-primary/10 shadow-2xl">
                <Bot className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">
                Master {subjectName} Today
              </h3>
              <p className="text-gray-400 mb-10 max-w-sm leading-relaxed">
                I'm your dedicated AI tutor. Ask me anything about the syllabus, practice problems, or complex concepts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(p.text)}
                    className="group flex items-center gap-3 p-4 rounded-2xl border border-white/[0.08] bg-[#12121a] hover:bg-[#181824] hover:border-primary/40 transition-all text-left shadow-xl"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <p.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500",
                    m.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-lg",
                      m.role === "user"
                        ? "bg-primary border-primary/20 text-primary-foreground"
                        : "bg-[#12121a] border-white/10 text-primary uppercase text-[10px] font-bold"
                    )}
                  >
                    {m.role === "user" ? (
                      <User className="w-5 h-5" />
                    ) : (
                      "AI"
                    )}
                  </div>

                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-6 py-4 text-base leading-relaxed tracking-tight shadow-2xl",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-[#12121a] border border-white/[0.08] text-gray-200 rounded-tl-none"
                    )}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 max-w-none break-words">
                        <ReactMarkdown>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="font-medium">{m.content}</span>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-4 items-center animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-[#12121a] border border-white/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-primary uppercase tracking-widest">
                    AI is processing...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-6 border-t border-white/[0.08] bg-[#12121a]/50">
        <div className="max-w-4xl mx-auto flex items-end gap-3 bg-[#0a0a0f] border border-white/[0.08] rounded-2xl p-3 focus-within:border-primary/50 transition-all shadow-2xl">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask your ${subjectName} tutor...`}
            className="flex-1 min-h-[44px] max-h-48 overflow-y-auto resize-none border-0 bg-transparent text-white placeholder:text-gray-600 focus-visible:ring-0 text-lg py-2"
            rows={1}
          />
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
            className="w-12 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all active:scale-95 shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-[10px] text-center text-gray-600 mt-4 font-bold uppercase tracking-[0.2em] px-4">
            Authorized Tutor Mode • Powered by Elyaitra AI v0.8.0
        </p>
      </div>
    </div>
  );
}
