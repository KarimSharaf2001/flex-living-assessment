import { HostawayReviewRaw } from "./types";

export const MOCK_RAW_DATA: HostawayReviewRaw[] = [
  {
    id: 7453,
    type: "host-to-guest",
    status: "published",
    rating: null,
    publicReview:
      "Shane and family are wonderful! Would definitely host again:)",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "respect_house_rules", rating: 10 },
    ],
    submittedAt: "2020-08-21 22:45:14",
    guestName: "Shane Finkelstein",
    listingName: "2B NI A 29 Shoreditch Heights",
  },
  {
    id: 7454,
    type: "guest-to-host",
    status: "published",
    rating: null,
    publicReview:
      "Amazing stay! The apartment was exactly as described. Very clean and modern.",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "location", rating: 10 },
      { category: "accuracy", rating: 10 },
    ],
    submittedAt: "2023-11-15 10:30:00",
    guestName: "Sarah Jenkins",
    listingName: "2B NI A 29 Shoreditch Heights",
  },
  {
    id: 7455,
    type: "guest-to-host",
    status: "published",
    rating: null,
    publicReview: "Bit noisy at night, but the location is unbeatable.",
    reviewCategory: [
      { category: "cleanliness", rating: 8 },
      { category: "location", rating: 10 },
      { category: "value", rating: 7 },
    ],
    submittedAt: "2023-10-05 14:15:00",
    guestName: "Mike Ross",
    listingName: "City Center Loft",
  },
];
