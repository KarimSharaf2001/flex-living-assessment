import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Review } from "../types";
import { API_BASE_URL } from "../config"; // Ensure correct import path
import {
  Star,
  Wifi,
  Monitor,
  Utensils,
  CheckCircle,
  MapPin,
  User,
} from "lucide-react";

// 1. Define the Raw shape locally for clarity
interface HostawayReviewRaw {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: { category: string; rating: number }[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  isVisible: boolean;
}

// 2. Configuration
const PROPERTY_MAP: Record<
  string,
  { name: string; title: string; price: number; images: string[] }
> = {
  "188027": {
    name: "2B N1 A - 29 Shoreditch Heights", // Must match backend exactly
    title: "Spacious 2 Bed Flat in Crystal Palace",
    price: 155,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800&auto=format&fit=crop",
    ],
  },
};

export const PropertyPage: React.FC = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const currentProperty = PROPERTY_MAP[id || ""] || PROPERTY_MAP["188027"];

  const colors = {
    primary: "#284E4C",
    bg: "#FFFDF6",
    textMain: "#333333",
    textLight: "#5C5C5A",
  };

  useEffect(() => {
    const fetchPublicReviews = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/reviews/hostaway`);
        // Handle the 'result' structure from backend
        const rawData: HostawayReviewRaw[] = res.data.result || [];

        console.log("Raw API Data:", rawData);

        const normalized: Review[] = rawData.map((r) => {
          const categorySum = r.reviewCategory.reduce(
            (acc, curr) => acc + curr.rating,
            0
          );
          const avgRating =
            r.rating ||
            (r.reviewCategory.length > 0
              ? categorySum / r.reviewCategory.length
              : 0);

          const categoriesMap: { [key: string]: number } = {};
          r.reviewCategory.forEach(
            (c) => (categoriesMap[c.category] = c.rating)
          );

          return {
            id: r.id,
            guestName: r.guestName,
            date: r.submittedAt,
            rating: parseFloat(avgRating.toFixed(1)),
            comment: r.publicReview,
            categories: categoriesMap,
            source: "Hostaway",
            isVisible: r.isVisible,
            listingName: r.listingName,
          };
        });

        console.log("Normalized Reviews:", normalized);

        // Filtering Logic with Debugging
        const pageSpecificReviews = normalized.filter((r) => {
          const isVisible = r.isVisible;
          // Normalize strings for safer comparison (trim whitespace)
          const backendName = r.listingName.trim();
          const targetName = currentProperty.name.trim();
          const matchesName = backendName === targetName;

          if (isVisible && !matchesName) {
            console.warn(
              `Skipped Review ID ${r.id}: Visible but name mismatch. Got '${backendName}', expected '${targetName}'`
            );
          }

          return isVisible && matchesName;
        });

        setReviews(pageSpecificReviews);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicReviews();
  }, [currentProperty, id]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "New";

  return (
    <div
      className="font-sans min-h-screen"
      style={{ backgroundColor: colors.bg, color: colors.textMain }}
    >
      {/* --- HEADER --- */}
      <nav
        className="sticky top-0 z-50 shadow-sm"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="max-w-7xl mx-auto px-4 h-[88px] flex justify-between items-center">
          <div className="text-white text-2xl font-bold tracking-tighter">
            FLEX <span className="font-normal">LIVING</span>
          </div>
          <div className="hidden md:flex gap-8 text-white text-sm font-medium">
            <a href="#" className="hover:opacity-80">
              Landlords
            </a>
            <a href="#" className="hover:opacity-80">
              About Us
            </a>
            <a href="#" className="hover:opacity-80">
              Contact
            </a>
            <button className="border border-white/30 rounded px-3 py-1">
              GBP (£)
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO GRID --- */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2 relative group cursor-pointer">
            <img
              src={currentProperty.images[0]}
              alt="Main"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>
          </div>
          {currentProperty.images.slice(1).map((img, idx) => (
            <div key={idx} className="bg-gray-200 relative">
              <img src={img} className="w-full h-full object-cover" />
              {idx === 3 && (
                <button className="absolute bottom-4 right-4 bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-gray-100">
                  Show all photos
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2">
          <div className="border-b pb-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">{currentProperty.title}</h1>
            <div className="flex gap-4 text-sm text-[#5C5C5A]">
              <span>5 Guests</span> • <span>2 Bedrooms</span> •{" "}
              <span>1 Bathroom</span>
            </div>
          </div>

          <div className="flex gap-6 mb-8 overflow-x-auto pb-2">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 min-w-[140px]">
              <Wifi className="text-[#284E4C]" size={20} />
              <span className="text-sm font-medium">Fast WiFi</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 min-w-[140px]">
              <Monitor className="text-[#284E4C]" size={20} />
              <span className="text-sm font-medium">Workspace</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 min-w-[140px]">
              <Utensils className="text-[#284E4C]" size={20} />
              <span className="text-sm font-medium">Kitchen</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">About this home</h2>
            <p className="text-[#5C5C5A] leading-relaxed mb-4">
              Welcome to your home away from home! This spacious and modern
              apartment offers the perfect blend of comfort and convenience.
            </p>
            <button className="text-[#284E4C] font-medium underline underline-offset-4 text-sm">
              Read more
            </button>
          </div>

          {/* --- REVIEWS SECTION --- */}
          <div id="reviews" className="mb-12 pt-8 border-t">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#284E4C] text-white p-2 rounded-lg">
                <Star size={24} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Guest Reviews</h2>
                <p className="text-[#5C5C5A] text-sm">
                  {reviews.length} Verified Reviews • Average {averageRating} /
                  10
                </p>
              </div>
            </div>

            {loading ? (
              <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="bg-white p-8 rounded-xl text-center border border-dashed border-gray-300">
                <p className="text-gray-500">
                  No reviews are currently visible for this property.
                  <br />
                  <span className="text-xs text-gray-400">
                    (Check the Dashboard to approve reviews for:{" "}
                    {currentProperty.name})
                  </span>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#284E4C] font-bold">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">
                            {review.guestName}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex bg-[#F1F3EE] px-2 py-1 rounded text-xs font-bold text-[#284E4C]">
                        {review.rating}/10
                      </div>
                    </div>

                    <p className="text-[#5C5C5A] text-sm leading-relaxed line-clamp-4">
                      "{review.comment}"
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {Object.entries(review.categories)
                        .slice(0, 3)
                        .map(([key, val]) => (
                          <span
                            key={key}
                            className="text-[10px] uppercase tracking-wider text-gray-400 border px-1.5 py-0.5 rounded"
                          >
                            {key.replace("_", " ")}: {val}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* --- END REVIEWS SECTION --- */}

          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">Location</h2>
            <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
              <MapPin size={32} />
              <span className="ml-2">Map Integration Placeholder</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-[#284E4C] p-4 text-center">
              <h3 className="text-white font-semibold">Book your stay</h3>
              <p className="text-white/80 text-xs">Select dates for prices</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-2xl font-bold text-[#333333]">
                    £{currentProperty.price}
                  </span>
                  <span className="text-sm text-gray-500"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Star size={14} fill="#284E4C" className="text-[#284E4C]" />
                  <span>{averageRating}</span>
                  <span className="text-gray-400">({reviews.length})</span>
                </div>
              </div>
              <button className="w-full bg-[#284E4C] text-white py-3.5 rounded-lg font-semibold hover:bg-[#1f3d3b] transition shadow-lg mb-4">
                Check Availability
              </button>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <CheckCircle size={12} />
                <span>Instant Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer
        className="mt-20 py-12 text-white"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center text-sm opacity-50">
          © 2025 The Flex. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
