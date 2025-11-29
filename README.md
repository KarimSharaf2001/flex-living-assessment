# Flex Living Developer Assessment - Documentation

**Submitted by:** Karim Sharaf

## 1. Tech Stack

This solution utilizes a modern, type-safe full-stack environment designed for performance and scalability, deployed seamlessly via Vercel.

### **Frontend**

- **React (Vite):** Chosen for its fast build times and component-based architecture.
- **TypeScript:** Used to ensure strict type safety between API responses and UI components.
- **Tailwind CSS:** Utilized for rapid UI development, ensuring design consistency with the Flex Living brand (e.g., hex code `#284E4C`).
- **Axios:** For streamlined HTTP requests and error handling.
- **Leaflet Maps:** Integrated for interactive, open-source property mapping.

### **Backend (Serverless)**

- **Node.js & Express:** Adapted to run as Vercel Serverless Functions.
- **TypeScript:** Maintains type consistency across the full stack.
- **CORS/Body-Parser:** Middleware for secure cross-origin resource sharing.

---

## 2. Key Design & Logic Decisions

### **Data Normalization Strategy**

The requirements specified strictly mirroring the raw Hostaway API response structure.

- **Decision:** The backend serves the **Raw** Hostaway data structure (nested `reviewCategory` arrays) to remain faithful to the source API.
- **Implementation:** Normalization logic (calculating average ratings, flattening category arrays into objects) was moved to the **Frontend**. This allows the UI to consume clean data while the API remains pure.

### **Review Approval Workflow & State Management**

- **Logic:** An `isVisible` boolean flag is injected into the data by the backend.
- **Default State:** All reviews are initialized as `isVisible: false` (Hidden).
- **Behavior:** The Dashboard allows a manager to click "Approve", which toggles the state to `true`. The Property Page filters and displays only `true` reviews.
- **Serverless Note:** Since this project is deployed on Vercel Serverless Functions without an external database (e.g., MongoDB/PostgreSQL), the data is stored in-memory. **Data persistence is ephemeral**; if the serverless function spins down (goes idle), the review statuses will reset to their default "Hidden" state.

### **Dynamic Property Mapping**

- **Logic:** The Listings Page fetches review data first, extracts unique `listingName` strings, and dynamically generates property cards. This ensures strict alignment between the Property Page title and the Backend data key `2B N1 A - 29 Shoreditch Heights`.

---

## 3. API Behaviors

### **`GET /api/reviews/hostaway`**

Fetches the complete list of reviews.

- **Response Format:** Returns a JSON object with `status: "success"` and a `result` array containing the nested, raw Hostaway data structure.
- **Augmentation:** The backend injects the `isVisible` property into each object to support the approval workflow.

### **`POST /api/reviews/:id/toggle`**

Toggles the visibility status of a specific review.

- **Logic:** Finds the review by ID in the in-memory store and flips the boolean value.
- **Frontend Handling:** The UI updates immediately (optimistic update) to ensure a snappy experience despite network latency.

---

## 4. Google Reviews Findings (Exploration)

**Status:** Not Implemented (Feasibility Study Only)

During the exploration phase, I determined that the standard **Google Places API** was not feasible for this specific assessment deployment.

### **Why Google Places API was rejected**

1.  **Billing & Subscription Requirements:** Accessing the Google Maps Platform (including the Places API) requires enabling a Billing Account with a valid credit card. As I do not currently have a payment method to subscribe to Google Cloud Platform services, I could not generate a valid API Key to perform the integration.
2.  **API Limitations:** Even with access, the standard `details` endpoint limits responses to only the **top 5 "most relevant" reviews**. It does not provide the full history of guest reviews, which would limit the utility of a trend-tracking dashboard.

### **Proposed Alternatives for Production**

To build a production-grade dashboard including Google Reviews, I recommend:

- **Option A: Google Business Profile API (Recommended)**
  - _Pros:_ Official API for business owners. Allows fetching **all** reviews and replying directly.
  - _Cons:_ Requires OAuth 2.0 and strict business ownership verification (2-4 week process).
- **Option B: Third-Party SERP APIs (e.g., SerpApi, Outscraper)**
  - _Pros:_ Scrapes Google Maps in real-time to return unlimited reviews in clean JSON. Bypasses the 5-review limit.
  - _Cons:_ Incurs a per-request cost and relies on scraping.

---

## 5. Deployment & Testing

The application is deployed as a monorepo on Vercel. The frontend serves static assets while the backend logic is handled via `vercel.json` rewrites pointing to a serverless API bridge.

### **Live Links**

- **Application URL:** `https://flexkmmmmm.vercel.app/`
- **API Endpoint:** `https://flexkmmmmm.vercel.app/api/reviews/hostaway`

### **Navigation Guide**

A developer navigation bar is pinned to the top of the screen to assist with evaluation:

1.  **Listings Page:** The public-facing landing page.
2.  **Manager Dashboard:** The internal tool for approving/hiding reviews.
3.  **Property Page:** The detailed view displaying only "Approved" reviews.
