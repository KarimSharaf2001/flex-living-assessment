import React, { useEffect, useState } from "react";
import axios from "axios";
import { Review } from "../types";
import {
  Star,
  User,
  MapPin,
  Share,
  Heart,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Monitor,
  ChevronDown,
  CheckCircle,
} from "lucide-react";

export const PropertyPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Flex Living Brand Colors from your HTML
  const colors = {
    primary: "#284E4C", // Dark Green
    bg: "#FFFDF6", // Cream/Off-white
    textMain: "#333333",
    textLight: "#5C5C5A",
  };

  useEffect(() => {
    const fetchPublicReviews = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/reviews/hostaway"
        );
        // FILTER: Only show reviews where isVisible === true
        setReviews(res.data.data.filter((r: Review) => r.isVisible));
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicReviews();
  }, []);

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
      {/* --- HEADER / NAVBAR (Matched to source) --- */}
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

      {/* --- HERO IMAGE GRID --- */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2 relative group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop"
              alt="Main"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>
          </div>
          <div className="bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=800&auto=format&fit=crop"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800&auto=format&fit=crop"
              className="w-full h-full object-cover"
            />
            <button className="absolute bottom-4 right-4 bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-gray-100">
              Show all photos
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT LAYOUT (2/3 Left, 1/3 Right) --- */}
      <main className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2">
          {/* Header Info */}
          <div className="border-b pb-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Spacious 2 Bed Flat in Crystal Palace
            </h1>
            <div className="flex gap-4 text-sm text-[#5C5C5A]">
              <span>5 Guests</span> • <span>2 Bedrooms</span> •{" "}
              <span>1 Bathroom</span>
            </div>
          </div>

          {/* Highlights */}
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

          {/* Description */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">About this home</h2>
            <p className="text-[#5C5C5A] leading-relaxed mb-4">
              Welcome to your home away from home! This spacious and modern
              2-bedroom apartment offers the perfect blend of comfort and
              convenience. Ideally located for families or corporate travelers.
            </p>
            <button className="text-[#284E4C] font-medium underline underline-offset-4 text-sm">
              Read more
            </button>
          </div>

          {/* --- REVIEWS SECTION (INTEGRATED HERE) --- */}
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
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4"
                  >
                    {/* User Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#284E4C] font-bold">
                          {review.guestName.charAt(0)}
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

                    {/* Review Content */}
                    <p className="text-[#5C5C5A] text-sm leading-relaxed line-clamp-4">
                      "{review.comment}"
                    </p>

                    {/* Categories (Mini tags) */}
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

          {/* Location / Map Placeholder */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">Location</h2>
            <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
              <MapPin size={32} />
              <span className="ml-2">Map Integration Placeholder</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Booking Widget) */}
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
                    £155
                  </span>
                  <span className="text-sm text-gray-500"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Star size={14} fill="#284E4C" className="text-[#284E4C]" />
                  <span>{averageRating}</span>
                  <span className="text-gray-400">({reviews.length})</span>
                </div>
              </div>

              {/* Fake Date Picker Inputs */}
              <div className="border rounded-lg mb-4 overflow-hidden">
                <div className="flex border-b">
                  <div className="w-1/2 p-3 border-r bg-[#F1F3EE] hover:bg-white cursor-pointer transition">
                    <div className="text-[10px] font-bold uppercase text-gray-500">
                      Check-in
                    </div>
                    <div className="text-sm">Add date</div>
                  </div>
                  <div className="w-1/2 p-3 bg-[#F1F3EE] hover:bg-white cursor-pointer transition">
                    <div className="text-[10px] font-bold uppercase text-gray-500">
                      Check-out
                    </div>
                    <div className="text-sm">Add date</div>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-gray-500">
                      Guests
                    </div>
                    <div className="text-sm">1 Guest</div>
                  </div>
                  <ChevronDown size={16} />
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

      {/* --- FOOTER --- */}
      <footer
        className="mt-20 py-12 text-white"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-bold text-lg mb-4">The Flex</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Professional property management for landlords, corporate rentals,
              and high-quality stays for guests.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Terms & Conditions</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Locations</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>London</li>
              <li>Paris</li>
              <li>Algiers</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <p className="text-sm text-white/70">info@theflex.global</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/20 text-center text-sm text-white/50"></div>
      </footer>
    </div>
  );
};
