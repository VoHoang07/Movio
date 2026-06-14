import { motion } from 'framer-motion';
import { ProgressBar } from './ProgressBar';

export function StatCard({ label, value, icon, color, progress = 65, delay = 0 }: { label: string; value: string | number; icon: string; color: string; progress?: number; delay?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="soft-card min-h-[115px] p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-muted">{label}</p>
          <p className="mt-2 text-3xl font-black" style={{ color }}>{value}</p>
        </div>
        <span className="rounded-2xl bg-white/70 p-3 text-2xl">{icon}</span>
      </div>
      <div className="mt-4"><ProgressBar value={progress} color={color} /></div>
    </motion.article>
  );
}
