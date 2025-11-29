# Flex Living Developer Assessment - Documentation

**Submitted by:** [Your Name]

## 1. Tech Stack

This solution utilizes a modern, type-safe full-stack environment designed for performance and scalability.

### **Frontend**

- **React (Vite):** Chosen for its fast build times and component-based architecture.
- **TypeScript:** Used to ensure strict type safety between API responses and UI components, reducing runtime errors.
- **Tailwind CSS:** Utilized for rapid UI development, ensuring design consistency with the Flex Living brand (e.g., specific hex codes like `#284E4C`).
- **Axios:** For streamlined HTTP requests and error handling.
- **Lucide React:** For lightweight, consistent iconography.

### **Backend**

- **Node.js & Express:** Provides a lightweight, flexible REST API structure.
- **TypeScript:** Maintains type consistency across the full stack (shared interfaces).
- **CORS/Body-Parser:** Middleware for secure cross-origin resource sharing and JSON parsing.

---

## 2. Key Design & Logic Decisions

### **Data Normalization Strategy**

The initial requirement suggested normalizing data on the backend, but the mock data structure requirements specified strictly mirroring the raw Hostaway API response.

- **Decision:** The backend serves the **Raw** Hostaway data structure (nested `reviewCategory` arrays) to remain faithful to the source API.
- **Implementation:** Normalization logic (calculating average ratings, flattening category arrays into objects) was moved to the **Frontend**. This allows the UI components to consume clean data while the API remains pure to the source.

### **Review Approval Workflow**

- **Logic:** An `isVisible` boolean flag was added to the in-memory data store.
- **Behavior:** By default, reviews are `hidden`. The dashboard allows a manager to toggle this state. The Public Property page explicitly filters for `isVisible === true`.
- **Persistence:** For this assessment, state is held in memory. In a production environment, this would persist to a PostgreSQL or MongoDB database.

### **Dynamic Property Mapping**

- **Logic:** The Listings Page does not use hardcoded listing cards. Instead, it fetches the review data first, extracts unique `listingName` strings from the dataset, and dynamically generates the property cards. This ensures that if new reviews come in for a new building, a card is automatically created.

---

## 3. API Behaviors

### **`GET /api/reviews/hostaway`**

Fetches the complete list of reviews.

- **Response Format:** Returns a JSON object with `status: "success"` and a `result` array containing the nested, raw Hostaway data structure.
- **Augmentation:** The backend injects the `isVisible` property into each object to support the approval workflow.

### **`POST /api/reviews/:id/toggle`**

Toggles the visibility status of a specific review.

- **Logic:** Finds the review by ID in the mock database and flips the boolean value.
- **Optimistic UI:** The frontend implements optimistic updates (updates the UI immediately before the server responds) to ensure the dashboard feels snappy.

---

## 4. Google Reviews Findings (Exploration)

**Status:** Not Implemented (Feasibility Study Only)

During the exploration phase, I determined that the standard **Google Places API** is not suitable for this specific "Manager Dashboard" use case. Below are the findings and proposed alternatives.

### **Why Google Places API was rejected**

1.  **The 5-Review Limit:** The standard Google Places API (`details` endpoint) limits responses to only the **top 5 "most relevant" reviews**. It does not provide the full history of guest reviews. This makes it impossible for a manager to spot long-term trends, calculate accurate aggregate scores, or perform full audits.
2.  **Rate Limits & Cost:** High-volume fetching requires billing enablement on the Google Cloud Platform and careful quota management, which adds significant overhead for a simple dashboard.

### **Proposed Alternatives for Production**

To build a production-grade dashboard that includes Google Reviews, I recommend one of the following approaches:

- **Option A: Google Business Profile API (Recommended)**
  - _Pros:_ This is the official API for business owners. It allows fetching **all** reviews (not just the top 5) and enables "Reply to Review" functionality directly from the Flex Living dashboard.
  - _Cons:_ High barrier to entry. It requires OAuth 2.0 authentication and strict business ownership verification (a 2-4 week approval process via postcard or video verification).
- **Option B: Third-Party SERP APIs (e.g., SerpApi, Outscraper)**
  - _Pros:_ These services scrape Google Maps in real-time and return unlimited reviews in clean JSON format. They bypass the 5-review limit without requiring OAuth.
  - _Cons:_ Incurs a per-request cost and relies on scraping, which can introduce slight latency.

---

## 5. How to Run

### **Backend**

1. Navigate to the server directory:
   ```bash
   cd server
   ```
