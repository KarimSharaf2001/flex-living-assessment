import express from "express";
import cors from "cors";
import { MOCK_RAW_DATA } from "./data";
import { NormalizedReview } from "./types";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://flex-assessment.vercel.app", // You will add this later
    ],
  })
);
app.use(express.json());

// In-memory store to persist "approval" status during the session
let db: NormalizedReview[] = MOCK_RAW_DATA.map((review) => {
  // Logic to calculate average rating if main rating is null
  const categorySum = review.reviewCategory.reduce(
    (acc, curr) => acc + curr.rating,
    0
  );
  const avgRating =
    review.rating ||
    (review.reviewCategory.length > 0
      ? categorySum / review.reviewCategory.length
      : 0);

  // Normalize categories to object for easier frontend lookup
  const categoriesMap: { [key: string]: number } = {};
  review.reviewCategory.forEach((c) => (categoriesMap[c.category] = c.rating));

  return {
    id: review.id,
    guestName: review.guestName,
    date: review.submittedAt,
    rating: parseFloat(avgRating.toFixed(1)), // Keep it to 1 decimal
    comment: review.publicReview,
    categories: categoriesMap,
    source: "Hostaway",
    isVisible: false, // Default to hidden as per "Reviews should be displayed only if approved" [cite: 22]
    listingName: review.listingName,
  };
});

// GET /api/reviews/hostaway - Fetch all reviews [cite: 51]
app.get("/api/reviews/hostaway", (req, res) => {
  res.json({
    status: "success",
    data: db,
  });
});

// POST /api/reviews/:id/toggle - Endpoint to approve/reject reviews [cite: 17]
app.post("/api/reviews/:id/toggle", (req, res) => {
  const { id } = req.params;
  const reviewIndex = db.findIndex((r) => r.id === parseInt(id));

  if (reviewIndex > -1) {
    db[reviewIndex].isVisible = !db[reviewIndex].isVisible;
    res.json({ success: true, review: db[reviewIndex] });
  } else {
    res.status(404).json({ error: "Review not found" });
  }
});

// Google Reviews Placeholders [cite: 25]
// This is where we would integrate Google Places API
app.get("/api/reviews/google", (req, res) => {
  // Implementation pending API Key for Google Places
  res.json({
    status: "success",
    message: "Google integration placeholder",
    data: [],
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
