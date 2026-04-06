import { Routes, Route } from "react-router-dom";
import TopNavBar from "./components/TopNavBar";
import SideNavBar from "./components/SideNavBar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import TriageResultsPage from "./pages/TriageResultsPage";

export default function App() {
  return (
    <div className="dark bg-background text-on-background min-h-screen">
      <TopNavBar />
      <SideNavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/triage" element={<TriageResultsPage />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}
