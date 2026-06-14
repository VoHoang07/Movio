import type { ReviewStatus } from '@/domain/types/ReviewStatus';

export interface ReviewSchedule {
  nextReviewDate: string;
  intervalDays: number;
  status: ReviewStatus;
  masteryLevel: number;
}
