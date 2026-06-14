import { motion } from 'framer-motion';

type MascotType = 'rabbit' | 'dog' | 'bear' | 'squirrel';

const faces: Record<MascotType, string> = {
  rabbit: '🐰',
  dog: '🐶',
  bear: '🐻',
  squirrel: '🐿️',
};

const accessories: Record<MascotType, string> = {
  rabbit: '💨',
  dog: '🎉',
  bear: '🚩',
  squirrel: '🌳',
};

export function Mascot({ type = 'rabbit', size = 'md', mood = 'happy' }: { type?: MascotType; size?: 'sm' | 'md' | 'lg'; mood?: string }) {
  const sizeClass = size === 'lg' ? 'text-8xl' : size === 'sm' ? 'text-5xl' : 'text-6xl';
  return (
    <motion.div
      aria-label={`${type} mascot ${mood}`}
      className="relative inline-flex items-center justify-center"
      animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span className={`drop-shadow-sm ${sizeClass}`}>{faces[type]}</span>
      <motion.span
        className="absolute -right-4 -top-2 text-2xl"
        animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        {accessories[type]}
      </motion.span>
    </motion.div>
  );
}
