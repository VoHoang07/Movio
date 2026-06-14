import type { ReviewStatus } from '@/domain/types/ReviewStatus';

export interface ReviewProgress {
  wordId: string;
  status: ReviewStatus;
  correctCount: number;
  wrongCount: number;
  nextReviewDate: string | null;
  lastReviewedDate: string | null;
  favorite: boolean;
  masteryLevel: number;
}
