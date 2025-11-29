import express from "express";
import cors from "cors";
import { MOCK_RAW_DATA } from "./data";
// You might need to create this file or remove the import if you don't want Google mocks
import { MOCK_GOOGLE_REVIEWS } from "./googleData";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://flex-reviews-umber.vercel.app", // Update this to match your actual Vercel URL
    ],
  })
);
app.use(express.json());

// 1. USE RAW DATA (Fixed)
// We map the raw data directly but add the 'isVisible' flag.
// We do NOT normalize (calculate averages) here anymore; the frontend does that.
let db = MOCK_RAW_DATA.map((review) => ({
  ...review,
  isVisible: false, // Default hidden
}));

// GET /api/reviews/hostaway
app.get("/api/reviews/hostaway", (req, res) => {
  res.json({
    status: "success",
    result: db, // <--- CHANGED from 'data' to 'result' to match Frontend expectation
  });
});

// POST /api/reviews/:id/toggle
app.post("/api/reviews/:id/toggle", (req, res) => {
  const { id } = req.params;
  const reviewIndex = db.findIndex((r) => r.id === parseInt(id));

  if (reviewIndex > -1) {
    db[reviewIndex].isVisible = !db[reviewIndex].isVisible;
    // Return success
    res.json({ success: true, review: db[reviewIndex] });
  } else {
    res.status(404).json({ error: "Review not found" });
  }
});

// GET /api/reviews/google (Simulation)
app.get("/api/reviews/google", (req, res) => {
  res.json({
    status: "OK",
    result: {
      name: "2B N1 A - 29 Shoreditch Heights",
      reviews: MOCK_GOOGLE_REVIEWS, // Ensure you have created server/src/googleData.ts
    },
  });
});

// Export for Vercel
export default app;

// Local Development Start
if (require.main === module) {
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
