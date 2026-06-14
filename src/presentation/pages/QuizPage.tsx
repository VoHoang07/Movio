import { useEffect, useState } from 'react';
import { speakText } from '@/lib/audio';
import { useReviewStore } from '@/stores/reviewStore';
import { Mascot } from '@/components/mascot/Mascot';
import { QuizOption } from '@/components/quiz/QuizOption';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function QuizPage() {
  const { quizQuestion, loadQuizQuestion, answerQuiz } = useReviewStore();
  const [selected, setSelected] = useState<string>('');
  const [correctId, setCorrectId] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [questionNo, setQuestionNo] = useState(1);
  useEffect(() => { void loadQuizQuestion(); }, [loadQuizQuestion]);
  if (!quizQuestion) return <div className="soft-card p-6">Preparing quiz...</div>;
  const choose = async (id: string) => { if (selected) return; setSelected(id); const correct = await answerQuiz(id); setFeedback(correct ? 'Correct! Mascot is dancing 🎉' : 'Oops! Review it once more 💛'); setCorrectId(correct ? id : ''); };
  const next = () => { setSelected(''); setCorrectId(''); setFeedback(''); setQuestionNo((n) => (n % 10) + 1); void loadQuizQuestion(); };
  return <div className="mx-auto max-w-4xl space-y-6 pt-6"><section className="soft-card p-7"><div className="flex flex-col items-center gap-5 md:flex-row"><Mascot type={feedback.startsWith('Correct') ? 'dog' : 'bear'} size="lg" /><div className="flex-1"><p className="font-black text-muted">Question {questionNo}/10</p><div className="mt-2"><ProgressBar value={questionNo * 10} color="#6F8F4E" /></div><p className="mt-5 text-6xl">{quizQuestion.prompt.emoji}</p><h2 className="mt-3 text-4xl font-black">What does “{quizQuestion.prompt.word}” mean?</h2><button type="button" onClick={() => speakText(quizQuestion.prompt.word)} className="mt-5 rounded-2xl bg-primary px-5 py-3 font-black text-white transition hover:scale-105">🔊 Listen</button></div></div></section><section className="grid gap-4 sm:grid-cols-2">{quizQuestion.options.map((option) => <QuizOption key={option.id} word={option.word} meaning={option.meaning} state={!selected ? 'idle' : option.id === selected ? (correctId === selected ? 'correct' : 'wrong') : 'idle'} onClick={() => void choose(option.id)} />)}</section>{feedback ? <div className="soft-card flex items-center justify-between gap-4 p-5"><p className="text-lg font-black text-primary-dark">{feedback}</p><button onClick={next} className="rounded-2xl bg-secondary px-7 py-3 font-black text-text transition hover:scale-105">Next →</button></div> : null}</div>;
}
