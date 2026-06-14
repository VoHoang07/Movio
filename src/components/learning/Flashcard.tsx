import { motion } from 'framer-motion';
import { speakText } from '@/lib/audio';
import type { VocabularyWord } from '@/domain/entities/VocabularyWord';

export function Flashcard({ word, flipped, onFlip }: { word: VocabularyWord; flipped: boolean; onFlip: () => void }) {
  return (
    <button type="button" onClick={onFlip} className="perspective-1000 w-full text-left">
      <motion.div
        className="soft-card min-h-[430px] p-8"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex min-h-[360px] flex-col items-center justify-center text-center [backface-visibility:hidden]">
          <p className="text-9xl">{word.emoji}</p>
          <h3 className="mt-6 text-6xl font-black text-primary-dark">{word.word}</h3>
          <p className="mt-3 text-xl font-bold text-muted">{word.pronunciation}</p>
          <span
            onClick={(event) => { event.stopPropagation(); speakText(word.word); }}
            className="mt-7 rounded-2xl bg-primary px-6 py-3 font-extrabold text-white shadow-soft transition hover:scale-105"
          >
            🔊 Listen
          </span>
        </div>
        <div className="absolute inset-8 flex rotate-y-180 flex-col justify-center rounded-[28px] bg-accent-blue/30 p-8 [backface-visibility:hidden]">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-muted">Meaning</p>
          <h3 className="mt-4 text-4xl font-black text-primary-dark">{word.meaning}</h3>
          <p className="mt-5 text-xl leading-relaxed text-muted">“{word.example}”</p>
          <p className="mt-8 text-sm font-bold text-muted">Tap card to flip back ✨</p>
        </div>
      </motion.div>
    </button>
  );
}
