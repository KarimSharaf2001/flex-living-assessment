import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  SlidersHorizontal,
  Bed,
  Bath,
  ChevronDown,
} from "lucide-react";

// Mock data adjusted to use only one property matching Hostaway
const PROPERTIES = [
  {
    id: 188027,
    title: "2B NI A 29 Shoreditch Heights",
    location: "London",
    guests: 5,
    bedrooms: 2,
    bathrooms: 1,
    price: 155,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop",
    isNew: true,
  },
];

export const ListingsPage: React.FC = () => {
  // Brand colors extracted from source HTML
  const colors = {
    primary: "#284E4C", // Dark Green
    bg: "#FFFDF7", // Cream/Off-white
    textMain: "#333333",
    textLight: "#929290", // The specific gray from source
    border: "rgba(92, 92, 90, 0.125)",
  };

  return (
    <div
      className="flex flex-col h-screen font-sans"
      style={{ backgroundColor: colors.bg }}
    >
      {/* --- HEADER (Fixed) --- */}
      <header
        className="sticky top-0 z-50 bg-[#FFFDF6] border-b h-[88px] flex-shrink-0"
        style={{ borderColor: colors.border }}
      >
        <div className="max-w-[1920px] mx-auto px-4 h-full flex justify-between items-center">
          <div className="text-[#284E4C] text-2xl font-bold tracking-tighter">
            FLEX <span className="font-normal">LIVING</span>
          </div>

          {/* Desktop Nav */}
          <div
            className="hidden md:flex gap-6 text-sm font-medium"
            style={{ color: colors.textMain }}
          >
            <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md transition">
              Landlords <ChevronDown size={16} />
            </button>
            <a
              href="#"
              className="hover:bg-gray-100 px-3 py-2 rounded-md transition"
            >
              About Us
            </a>
            <a
              href="#"
              className="hover:bg-gray-100 px-3 py-2 rounded-md transition"
            >
              Careers
            </a>
            <a
              href="#"
              className="hover:bg-gray-100 px-3 py-2 rounded-md transition"
            >
              Contact
            </a>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100">
              🇬🇧 GBP
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT (Split Layout) --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT COLUMN: Listings & Filters */}
        <div
          className="w-full lg:w-[60%] flex flex-col border-r"
          style={{ borderColor: colors.border }}
        >
          {/* Filter Bar (Sticky) */}
          <div
            className="sticky top-0 z-40 bg-[#FFFDF7] border-b p-3"
            style={{ borderColor: colors.border }}
          >
            <div className="flex gap-3">
              <button
                className="flex-1 flex items-center justify-between border rounded-md px-3 py-2 text-sm bg-white hover:bg-gray-50 transition"
                style={{
                  borderColor: "rgba(92,92,90,0.25)",
                  color: colors.textMain,
                }}
              >
                <div className="flex items-center gap-2 text-[#929290]">
                  <MapPin size={16} /> <span>London</span>
                </div>
                <ChevronDown size={16} className="opacity-50" />
              </button>

              <button
                className="flex-1 flex items-center gap-2 border rounded-md px-3 py-2 text-sm bg-white text-[#929290] hover:bg-gray-50 transition"
                style={{ borderColor: "rgba(92,92,90,0.25)" }}
              >
                <Calendar size={16} /> <span>Dates</span>
              </button>

              <button
                className="w-24 flex items-center justify-center gap-2 border rounded-md px-3 py-2 text-sm bg-white hover:bg-gray-50 transition"
                style={{ borderColor: "rgba(92,92,90,0.25)" }}
              >
                <Users size={16} className="text-[#929290]" />
                <span>1</span>
              </button>

              <button
                className="flex items-center gap-1 border rounded-md px-4 py-2 text-xs font-medium bg-white hover:bg-gray-50 transition"
                style={{
                  borderColor: "rgba(92,92,90,0.25)",
                  color: colors.textLight,
                }}
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>

            <div className="mt-4 px-1">
              <p
                className="text-xs leading-relaxed"
                style={{ color: colors.textLight }}
              >
                Discover flexible, fully furnished apartments in London. Ideal
                for short, medium or long stays. From Covent Garden lofts to
                Canary Wharf executive suites.
              </p>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#FFFDF7]">
            <div className="mb-4 text-sm" style={{ color: colors.textLight }}>
              Found {PROPERTIES.length} properties
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              {PROPERTIES.map((property) => (
                <Link
                  to={`/property/${property.id}`}
                  key={property.id}
                  className="block group"
                >
                  <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-[#FFFDF6]">
                    {/* Image Container */}
                    <div className="relative aspect-[16/9]">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Price Badge */}
                      <div className="absolute top-2 right-2">
                        <div className="backdrop-blur-md bg-[#FFFDF6]/90 border border-[#5C5C5A]/10 rounded-md px-2 py-1 shadow-sm">
                          <div className="flex flex-col items-end leading-none">
                            <span
                              className="text-base font-bold"
                              style={{ color: colors.primary }}
                            >
                              £{property.price}
                            </span>
                            <span
                              className="text-[10px]"
                              style={{ color: colors.textLight }}
                            >
                              per night
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3
                        className="text-lg font-bold mb-2 line-clamp-1"
                        style={{ color: colors.textMain }}
                      >
                        {property.title}
                      </h3>
                      <p
                        className="text-sm mb-3"
                        style={{ color: colors.textLight }}
                      >
                        {property.location}
                      </p>

                      {/* Stats Row */}
                      <div
                        className="flex items-center gap-4 text-xs"
                        style={{ color: colors.textLight }}
                      >
                        <div className="flex items-center gap-1">
                          <Bed size={14} />{" "}
                          <span>{property.bedrooms} Bedrooms</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath size={14} />{" "}
                          <span>{property.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />{" "}
                          <span>Up to {property.guests}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Map Placeholder */}
        <div className="hidden lg:block w-[40%] bg-[#E5E3DF] relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <MapPin size={48} className="mb-2 opacity-50" />
            <span className="text-sm font-medium opacity-70">
              Interactive Map Area
            </span>
            <span className="text-xs opacity-50">
              (Google Maps Integration)
            </span>
          </div>

          {/* Floating Map Controls Simulation */}
          <div className="absolute bottom-8 right-4 flex flex-col gap-2">
            <button className="bg-white p-2 rounded shadow text-gray-600 hover:bg-gray-50">
              +
            </button>
            <button className="bg-white p-2 rounded shadow text-gray-600 hover:bg-gray-50">
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
