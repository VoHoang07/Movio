import { motion } from 'framer-motion';

export function ProgressBar({ value, color = '#6F8F4E' }: { value: number; color?: string }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-[#EDE7DA]">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${safeValue}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}
