export interface Review {
  id: number;
  guestName: string;
  date: string;
  rating: number;
  comment: string;
  categories: { [key: string]: number };
  source: "Hostaway" | "Google";
  isVisible: boolean;
  listingName: string;
}
