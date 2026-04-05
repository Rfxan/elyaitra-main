'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Check,
  X,
  Edit3,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  status: "unknown" | "known" | "revision";
}

const mockFlashcards: Flashcard[] = [
  { id: "1", front: "Second generation solar cells are commonly known as _____ solar cells.", back: "thin-film solar cells", status: "unknown" },
  { id: "2", front: "How are thin-film solar cells constructed?", back: "They are made by depositing one or more very thin layers of photovoltaic materials onto substrates like glass, plastic, or metal.", status: "unknown" },
  { id: "3", front: "What is a key advantage of the thin-film construction of second generation solar cells?", back: "t reduces material use and allows for the creation of flexible and lightweight solar panels.", status: "unknown" },
  { id: "4", front: "What is the main technological goal of third generation solar cells?", back: "They are designed to surpass the efficiency and cost limitations of earlier generations, aiming to break the Shockley-Queisser limit.", status: "unknown" },
  { id: "5", front: "How do Dye-Sensitized Solar Cells (DSSCs) function to generate charge?", back: "They use a photosensitive dye to capture sunlight and create electron-hole pairs, often with a semiconductor like titanium dioxide.", status: "unknown" },
];

export default function FlashcardViewer() {
  const [cards, setCards] = useState<Flashcard[]>(mockFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const currentCard = cards[currentIndex];
  const knownCount = cards.filter((c) => c.status === "known").length;
  const revisionCount = cards.filter((c) => c.status === "revision").length;

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const shuffleCards = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const resetCards = () => {
    setCards(cards.map((c) => ({ ...c, status: "unknown" })));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const markCard = (status: "known" | "revision") => {
    setCards((prev) =>
      prev.map((card, index) =>
        index === currentIndex ? { ...card, status } : card
      )
    );
    nextCard();
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="p-5 border-b border-white/[0.08] bg-[#12121a]/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Layers className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Smart Flashcards</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
              {currentIndex + 1} of {cards.length} Cards
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 font-bold">
            <Check className="w-3 h-3 mr-1" />
            {knownCount} Mastered
          </Badge>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 px-3 py-1 font-bold">
            <RotateCcw className="w-3 h-3 mr-1" />
            {revisionCount} Review
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pt-6">
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div
            className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(7,186,255,0.5)]"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            />
        </div>
      </div>

      {/* Flashcard Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative w-full max-w-2xl h-80 sm:h-96 cursor-pointer"
          style={{ perspective: "2000px" }}
        >
          <div
            className={cn(
              "relative w-full h-full transition-all duration-700 transform-gpu",
              isFlipped && "[transform:rotateY(180deg)]"
            )}
            style={{ 
                transformStyle: "preserve-3d",
            }}
          >
            {/* Front Side */}
            <div
              className={cn(
                "absolute inset-0 rounded-[2.5rem] border-2 p-10 flex flex-col items-center justify-center text-center shadow-2xl transition-colors duration-500 [backface-visibility:hidden]",
                currentCard.status === "known"
                  ? "border-emerald-500/50 bg-emerald-500/5 shadow-emerald-500/10"
                  : currentCard.status === "revision"
                  ? "border-amber-500/50 bg-amber-500/5 shadow-amber-500/10"
                  : "border-white/[0.08] bg-[#12121a]"
              )}
            >
              <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">Question</span>
              </div>
              
              <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                {currentCard.front}
              </p>
              
              <div className="absolute bottom-8 text-gray-600 animate-bounce">
                <p className="text-[10px] font-bold uppercase tracking-widest">Click to Flip</p>
              </div>
            </div>

            {/* Back Side */}
            <div
              className="absolute inset-0 rounded-[2.5rem] border-2 border-primary/50 bg-[#181824] p-10 flex flex-col items-center justify-center text-center shadow-2xl [transform:rotateY(180deg)] [backface-visibility:hidden]"
            >
              <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Answer</span>
              </div>
              
              <div className="prose prose-invert max-w-none">
                 <p className="text-lg sm:text-xl font-medium text-indigo-100 leading-relaxed italic">
                    {currentCard.back}
                 </p>
              </div>

               <div className="absolute bottom-8 text-gray-600">
                <p className="text-[10px] font-bold uppercase tracking-widest">Mastery Level: {currentCard.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-8 border-t border-white/[0.08] bg-[#12121a]/50">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Mark as Known/Revision */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="flex-1 h-14 rounded-2xl border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 font-bold gap-3 transition-all"
              onClick={(e) => { e.stopPropagation(); markCard("revision"); }}
            >
              <X className="w-5 h-5" />
              Need Review
            </Button>
            <Button
              className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-3 transition-all shadow-lg shadow-emerald-600/20"
              onClick={(e) => { e.stopPropagation(); markCard("known"); }}
            >
              <Check className="w-5 h-5" />
              Got It!
            </Button>
          </div>

          {/* Navigation & Utils */}
          <div className="flex items-center justify-between gap-4 px-2">
            <div className="flex gap-2">
                <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl border-white/[0.08] bg-black/20 hover:bg-white/5" onClick={prevCard}>
                    <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl border-white/[0.08] bg-black/20 hover:bg-white/5" onClick={nextCard}>
                    <ChevronRight className="w-6 h-6" />
                </Button>
            </div>
            
            <div className="flex gap-2">
                <Button variant="outline" size="icon" title="Shuffle Deck" className="w-12 h-12 rounded-xl border-white/[0.08] bg-black/20 hover:bg-white/5" onClick={shuffleCards}>
                    <Shuffle className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" title="Reset All" className="w-12 h-12 rounded-xl border-white/[0.08] bg-black/20 hover:bg-white/5" onClick={resetCards}>
                    <RotateCcw className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" title="Edit Card" className="w-12 h-12 rounded-xl border-white/[0.08] bg-black/20 hover:bg-white/5" onClick={() => setIsEditing(!isEditing)}>
                    <Edit3 className="w-5 h-5" />
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
