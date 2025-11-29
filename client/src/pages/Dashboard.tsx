import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { HostawayReviewRaw, NormalizedReview } from "../types";
import {
  LayoutDashboard,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  Home,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "hidden"
  >("all");

  // Fetch Data
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/reviews/hostaway");
      setReviews(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id: number) => {
    // Optimistic UI update for speed
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isVisible: !r.isVisible } : r))
    );
    try {
      await axios.post(`http://localhost:3001/api/reviews/${id}/toggle`);
    } catch (err) {
      console.error("Failed to toggle", err);
      fetchReviews(); // Revert on error
    }
  };

  // --- DERIVED DATA & ANALYTICS ---

  // 1. Unique Properties for Dropdown
  const properties = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.listingName))),
    [reviews]
  );

  // 2. Filter Logic
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProperty =
        selectedProperty === "all" || r.listingName === selectedProperty;
      const matchesRating = r.rating >= minRating;
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "published"
          ? r.isVisible
          : !r.isVisible;

      return matchesSearch && matchesProperty && matchesRating && matchesStatus;
    });
  }, [reviews, searchTerm, selectedProperty, minRating, statusFilter]);

  // 3. KPI Metrics
  const metrics = useMemo(() => {
    const total = filteredReviews.length;
    const avgRating =
      total > 0
        ? (
            filteredReviews.reduce((acc, r) => acc + r.rating, 0) / total
          ).toFixed(1)
        : "0.0";
    const publishedCount = filteredReviews.filter((r) => r.isVisible).length;
    const pendingCount = total - publishedCount;

    // Calculate lowest category average (Trend Spotting)
    const catTotals: Record<string, { sum: number; count: number }> = {};
    filteredReviews.forEach((r) => {
      Object.entries(r.categories).forEach(([cat, val]) => {
        if (!catTotals[cat]) catTotals[cat] = { sum: 0, count: 0 };
        catTotals[cat].sum += val;
        catTotals[cat].count++;
      });
    });

    // Find the category with the lowest average score
    let issueCategory = "None";
    let lowestScore = 11;
    Object.entries(catTotals).forEach(([cat, data]) => {
      const avg = data.sum / data.count;
      if (avg < lowestScore) {
        lowestScore = avg;
        issueCategory = cat;
      }
    });

    return {
      total,
      avgRating,
      publishedCount,
      pendingCount,
      issueCategory,
      lowestScore: lowestScore === 11 ? 0 : lowestScore.toFixed(1),
    };
  }, [filteredReviews]);

  // --- RENDER HELPERS ---

  // Helper to color code ratings (Green > 9, Yellow > 7, Red < 7)
  const getScoreColor = (score: number) => {
    if (score >= 9) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 7) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-[#284E4C] text-white h-16 flex items-center px-8 shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={20} />
          <h1 className="font-bold text-lg tracking-wide">
            FLEX LIVING{" "}
            <span className="font-normal opacity-70">| Manager Console</span>
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
        {/* 1. ANALYTICS CARDS (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
              Total Reviews
            </div>
            <div className="text-3xl font-bold flex items-end gap-2">
              {metrics.total}
              <span className="text-xs font-normal text-gray-400 mb-1">
                filtered
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
              Average Rating
            </div>
            <div className="text-3xl font-bold flex items-end gap-2">
              {metrics.avgRating}
              <Star
                size={20}
                className="mb-1 text-yellow-500 fill-yellow-500"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
              Publish Status
            </div>
            <div className="flex gap-4">
              <div>
                <span className="block text-2xl font-bold text-green-600">
                  {metrics.publishedCount}
                </span>
                <span className="text-xs text-gray-400">Live</span>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div>
                <span className="block text-2xl font-bold text-gray-600">
                  {metrics.pendingCount}
                </span>
                <span className="text-xs text-gray-400">Hidden</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex flex-col justify-between bg-gradient-to-br from-white to-red-50">
            <div className="flex items-center gap-2 text-red-800 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertCircle size={14} />
              Attention Area
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800 capitalize">
                {metrics.issueCategory.replace(/_/g, " ")}
              </div>
              <div className="text-xs text-red-600 font-medium">
                Avg Score: {metrics.lowestScore}/10
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                Lowest performing category across filtered view
              </div>
            </div>
          </div>
        </div>

        {/* 2. FILTER BAR */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center justify-between sticky top-20 z-30">
          {/* Left: Search & Property */}
          <div className="flex flex-wrap gap-4 items-center flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search guest or review..."
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#284E4C] w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
              <Home size={16} className="text-gray-400" />
              <select
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
              >
                <option value="all">All Properties</option>
                {properties.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Filters */}
          <div className="flex items-center gap-3">
            <select
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Status: All</option>
              <option value="published">Status: Published</option>
              <option value="hidden">Status: Hidden</option>
            </select>

            <select
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              <option value="0">Rating: All</option>
              <option value="9">9+ Excellent</option>
              <option value="7">7+ Good</option>
              <option value="1">Any Rating</option>
            </select>
          </div>
        </div>

        {/* 3. MAIN DATA TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold w-24">Status</th>
                <th className="p-4 font-semibold w-16 text-center">Score</th>
                <th className="p-4 font-semibold w-1/4">Guest / Property</th>
                <th className="p-4 font-semibold w-1/3">
                  Comment & Category Breakdown
                </th>
                <th className="p-4 font-semibold w-32">Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Loading data...
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No reviews found matching filters.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* Status Badge */}
                    <td className="p-4 align-top">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          review.isVisible
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {review.isVisible ? (
                          <>
                            <CheckCircle size={10} /> Live
                          </>
                        ) : (
                          <>
                            <XCircle size={10} /> Hidden
                          </>
                        )}
                      </span>
                    </td>

                    {/* Overall Rating */}
                    <td className="p-4 align-top text-center">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border mx-auto ${getScoreColor(
                          review.rating
                        )}`}
                      >
                        {review.rating}
                      </div>
                    </td>

                    {/* Guest Info */}
                    <td className="p-4 align-top">
                      <div className="font-semibold text-gray-900">
                        {review.guestName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Home size={10} />
                        {review.listingName}
                      </div>
                    </td>

                    {/* Comment & Category Sparklines */}
                    <td className="p-4 align-top">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3 group-hover:line-clamp-none transition-all">
                        "{review.comment}"
                      </p>

                      {/* Category Breakdown (Mini Dashboard inside row) */}
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(review.categories).map(
                          ([cat, score]) => (
                            <div
                              key={cat}
                              className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-[10px] text-gray-600 border border-gray-200"
                            >
                              <span className="capitalize">
                                {cat.replace(/_/g, " ")}
                              </span>
                              <span
                                className={`font-bold ${
                                  score < 8 ? "text-red-500" : "text-gray-900"
                                }`}
                              >
                                {score}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Actions (Toggle) */}
                    <td className="p-4 align-top text-right">
                      <button
                        onClick={() => toggleVisibility(review.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          review.isVisible
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-transparent"
                            : "bg-[#284E4C] text-white hover:bg-[#1f3d3b] shadow-sm"
                        }`}
                      >
                        {review.isVisible ? (
                          <>
                            Hide Review <EyeOff size={16} />
                          </>
                        ) : (
                          <>
                            Approve <Eye size={16} />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
