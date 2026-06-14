import { motion } from 'framer-motion';

export function QuizOption({ word, meaning, state, onClick }: { word: string; meaning: string; state: 'idle' | 'correct' | 'wrong'; onClick: () => void }) {
  const tone = state === 'correct' ? 'border-success bg-success/15' : state === 'wrong' ? 'border-error bg-error/15' : 'border-transparent bg-white';
  return (
    <motion.button
      type="button"
      onClick={onClick}
      animate={state !== 'idle' ? { scale: [1, 1.04, 1] } : {}}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`rounded-[26px] border-2 p-5 text-left shadow-soft transition ${tone}`}
    >
      <p className="text-sm font-bold text-muted">{word}</p>
      <p className="mt-2 text-2xl font-black text-text">{meaning}</p>
    </motion.button>
  );
}
