import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReviewStore } from '@/stores/reviewStore';
import { Mascot } from '@/components/mascot/Mascot';

export function ReviewPage() {
  const { dueItems, loadDueReviews, submitReview, loading } = useReviewStore();
  useEffect(() => { void loadDueReviews(); }, [loadDueReviews]);
  return <div className="space-y-6 pt-6"><section className="soft-card flex items-center gap-5 p-7"><Mascot type="squirrel" size="md" /><div><h2 className="text-4xl font-black text-primary-dark">🌱 Review Meadow</h2><p className="mt-2 text-lg font-bold text-muted">Practice words scheduled for today with spaced repetition.</p></div></section>{loading ? <div className="soft-card p-6">Loading due reviews...</div> : dueItems.length === 0 ? <div className="soft-card p-7 text-center"><Mascot type="bear" size="lg" /><p className="mt-4 text-2xl font-black">No words are due right now. Great job!</p></div> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{dueItems.map((item, i) => <motion.article key={item.wordId} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }} className="soft-card p-6"><p className="text-6xl">{item.emoji}</p><h3 className="mt-4 text-3xl font-black text-primary-dark">{item.word}</h3><p className="mt-2 text-xl font-bold text-muted">{item.meaning}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => void submitReview(item.wordId, false)} className="rounded-2xl bg-accent-orange px-4 py-3 font-black text-white transition hover:scale-105">🔁 Again</button><button type="button" onClick={() => void submitReview(item.wordId, true)} className="rounded-2xl bg-success px-4 py-3 font-black text-white transition hover:scale-105">✅ Good</button></div></motion.article>)}</div>}</div>;
}
