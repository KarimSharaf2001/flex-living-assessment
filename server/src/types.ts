export interface HostawayReviewRaw {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: { category: string; rating: number }[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface NormalizedReview {
  id: number;
  guestName: string;
  date: string;
  rating: number; // Normalized average
  comment: string;
  categories: { [key: string]: number };
  source: "Hostaway" | "Google";
  isVisible: boolean; // For the manager dashboard logic
  listingName: string;
}
