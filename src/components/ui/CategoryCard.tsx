import { motion } from 'framer-motion';
import { ProgressBar } from './ProgressBar';

export function CategoryCard({ title, words, icon, bg, color, progress }: { title: string; words: number; icon: string; bg: string; color: string; progress: number }) {
  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.03 }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[178px] rounded-[26px] p-5 shadow-soft transition"
      style={{ background: bg }}
    >
      <div className="text-5xl">{icon}</div>
      <h3 className="mt-5 text-lg font-black" style={{ color }}>{title}</h3>
      <p className="mt-1 text-sm font-bold text-muted">{words} words</p>
      <div className="mt-5"><ProgressBar value={progress} color={color} /></div>
    </motion.article>
  );
}
