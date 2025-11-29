import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { PropertyPage } from "./pages/PropertyPage";
import { ListingsPage } from "./pages/ListingsPage";
import { LayoutDashboard, Home, Map } from "lucide-react";

function App() {
  return (
    <BrowserRouter>
      {/* --- DEV NAVIGATION BAR --- */}
      <div className="bg-gray-900 text-white text-xs py-2 px-4 flex justify-center items-center gap-6 sticky top-0 z-[100]">
        <span className="text-gray-500 font-bold uppercase tracking-widest">
          Dev Nav:
        </span>

        <Link
          to="/"
          className="flex items-center gap-1 hover:text-green-400 transition-colors"
        >
          <Map size={14} /> Listings Page (Home)
        </Link>

        <span className="text-gray-700">|</span>

        <Link
          to="/dashboard"
          className="flex items-center gap-1 hover:text-green-400 transition-colors"
        >
          <LayoutDashboard size={14} /> Manager Dashboard
        </Link>

        <span className="text-gray-700">|</span>

        {/* Shortcut to specific property for testing */}
        <Link
          to="/property/188027"
          className="flex items-center gap-1 hover:text-green-400 transition-colors"
        >
          <Home size={14} /> Property Page (Demo)
        </Link>
      </div>

      {/* --- APP ROUTES --- */}
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/property/:id" element={<PropertyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
