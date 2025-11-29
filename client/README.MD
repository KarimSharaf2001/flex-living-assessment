Flex Living Developer Assessment - Documentation

1. Tech Stack
   This solution utilizes a modern, type-safe full-stack environment designed for performance and scalability.

Frontend
React (Vite): Chosen for its fast build times and component-based architecture.

TypeScript: Used to ensure strict type safety between API responses and UI components, reducing runtime errors.

Tailwind CSS: Utilized for rapid UI development, ensuring design consistency with the Flex Living brand (e.g., specific hex codes like #284E4C).

Axios: For streamlined HTTP requests and error handling.

Lucide React: For lightweight, consistent iconography.

Backend
Node.js & Express: Provides a lightweight, flexible REST API structure.

TypeScript: Maintains type consistency across the full stack (shared interfaces).

CORS/Body-Parser: Middleware for secure cross-origin resource sharing and JSON parsing.

2. Key Design & Logic Decisions
   Data Normalization Strategy
   While the initial requirement suggested normalizing data on the backend, the mock data structure requirements changed to strictly mirror the raw Hostaway API.

Decision: The backend serves the Raw Hostaway data structure (nested reviewCategory arrays) to remain faithful to the source API .

Implementation: Normalization logic (calculating average ratings, flattening category arrays into objects) was moved to the Frontend. This allows the UI components to consume clean data while the API remains pure.

Review Approval Workflow
Logic: An isVisible boolean flag was added to the in-memory data store.

Behavior: By default, reviews are hidden. The dashboard allows a manager to toggle this state. The Public Property page explicitly filters for isVisible === true.

Persistence: For this assessment, state is held in memory. In a production environment, this would persist to a PostgreSQL or MongoDB database.

Dynamic Property Mapping
Logic: The Listings Page does not use hardcoded listing cards. Instead, it fetches the review data first, extracts unique listingName strings from the dataset, and dynamically generates the property cards. This ensures that if new reviews come in for a new building, a card is automatically created.

3. API Behaviors
   GET /api/reviews/hostaway
   Fetches the complete list of reviews.

Response Format: Returns a JSON object with status: "success" and a result array containing the nested, raw Hostaway data structure.

Augmentation: The backend injects the isVisible property into each object to support the approval workflow.

POST /api/reviews/:id/toggle
Toggles the visibility status of a specific review.

Logic: Finds the review by ID in the mock database and flips the boolean value.

Optimistic UI: The frontend implements optimistic updates (updates the UI immediately before the server responds) to ensure the dashboard feels snappy.

GET /api/reviews/google
A simulation endpoint that returns data structured exactly like the Google Places API response. This allows the frontend to demonstrate how it would merge and normalize data from two different sources (Hostaway's 10-point scale vs. Google's 5-star scale).

4. Google Reviews Findings (Exploration)
   Why the Google Places API was not fully implemented
   During the exploration phase , I determined that the standard Google Places API (Details Endpoint) is insufficient for a robust "Manager Dashboard" for the following reasons:

** The 5-Review Limit:** The standard API only returns the top 5 "most relevant" reviews. It does not provide the full history of reviews. This makes it impossible for a manager to spot long-term trends or calculate accurate aggregate scores.

Rate Limits & Cost: High-volume fetching requires billing enablement on Google Cloud Platform, which was outside the scope of this sandbox assessment.

Proposed Alternatives
To build a production-grade dashboard, I recommend one of the following approaches instead:

Option A: Google Business Profile API (Recommended)

Pros: Allows fetching all reviews and responding to them directly via the API.

Cons: Requires OAuth 2.0 authentication and strict business ownership verification (2-4 week approval process).

Option B: Third-Party SERP APIs (e.g., SerpApi, Outscraper)

Pros: These services scrape Google Maps in real-time and return unlimited reviews in clean JSON format.

Cons: Incurs a per-request cost.

Conclusion: For this assessment, I implemented a Mock Integration on the backend. The system is architected to accept Google Data, normalize the 5-star rating to a 10-point scale (e.g., Google Rating \* 2), and display it alongside Hostaway reviews seamlessly.

5. How to Run
   Backend: cd server -> npm install -> npx ts-node src/index.ts (Port 3001)

Frontend: cd client -> npm install -> npm run dev (Port 5173)
