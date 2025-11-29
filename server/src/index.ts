import express from "express";
import cors from "cors";
import { MOCK_RAW_DATA } from "./data";

const app = express();

// 1. DISABLE CACHING (Crucial for the "Approve" button to reflect changes immediately)
app.set("etag", false);
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://flexkmmmmm.vercel.app", // Your Vercel Frontend
    ],
  })
);
app.use(express.json());

// 2. INITIALIZE DATABASE (Raw Data)
let db: any[] = MOCK_RAW_DATA.map((review) => ({
  ...review,
  isVisible: false, // Default hidden
}));

// GET /api/reviews/hostaway
app.get("/api/reviews/hostaway", (req, res) => {
  res.json({
    status: "success",
    result: db,
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

// Export for Vercel
export default app;

// Local Development Start
if (require.main === module) {
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
