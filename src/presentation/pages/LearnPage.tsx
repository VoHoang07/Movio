import { useEffect, useMemo, useState } from 'react';
import { useVocabularyStore } from '@/stores/vocabularyStore';
import { useReviewStore } from '@/stores/reviewStore';
import { Flashcard } from '@/components/learning/Flashcard';
import { Mascot } from '@/components/mascot/Mascot';

export function LearnPage() {
  const { items, load } = useVocabularyStore();
  const { submitReview } = useReviewStore();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { void load(); }, [load]);
  const current = useMemo(() => items[index] ?? null, [items, index]);
  const handleAnswer = async (isCorrect: boolean) => { if (!current) return; await submitReview(current.id, isCorrect); setFlipped(false); setIndex((p) => (items.length === 0 ? 0 : (p + 1) % items.length)); };
  if (!current) return <div className="soft-card p-6">Loading flashcards...</div>;
  return <div className="mx-auto max-w-4xl space-y-6 pt-6"><section className="text-center"><Mascot type="rabbit" size="md" /><p className="mt-2 text-sm font-black uppercase tracking-[0.24em] text-muted">Flashcards</p><h2 className="mt-2 text-4xl font-black text-primary-dark">Learn one movement at a time</h2><p className="mt-2 font-bold text-muted">Tap the card to flip, listen, then choose your memory feeling.</p></section><Flashcard word={current} flipped={flipped} onFlip={() => setFlipped((v) => !v)} /><div className="grid gap-4 sm:grid-cols-2"><button type="button" onClick={() => void handleAnswer(false)} className="rounded-[24px] bg-accent-orange px-6 py-4 text-lg font-black text-white shadow-soft transition hover:scale-105">🔁 Review Again</button><button type="button" onClick={() => void handleAnswer(true)} className="rounded-[24px] bg-success px-6 py-4 text-lg font-black text-white shadow-soft transition hover:scale-105">✅ I Know</button></div></div>;
}
