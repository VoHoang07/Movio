import { motion } from 'framer-motion';

const leaves = [
  { id: 1, left: '12%', delay: 0, duration: 16, icon: '🍃' },
  { id: 2, left: '34%', delay: 2, duration: 18, icon: '🌿' },
  { id: 3, left: '61%', delay: 5, duration: 15, icon: '🍃' },
  { id: 4, left: '82%', delay: 1, duration: 19, icon: '🍂' },
];

export function FloatingLeaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((leaf) => (
        <motion.span
          key={leaf.id}
          className="absolute top-[-10%] text-2xl opacity-70"
          style={{ left: leaf.left }}
          animate={{ y: ['0vh', '110vh'], x: [0, 24, -16, 12], rotate: [0, 18, -12, 16] }}
          transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: 'linear' }}
        >
          {leaf.icon}
        </motion.span>
      ))}
    </div>
  );
}
