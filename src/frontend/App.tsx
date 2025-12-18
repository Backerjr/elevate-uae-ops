import { Routes, Route, Navigate } from "react-router-dom";
import AdrenalineLanding from "./pages/AdrenalineLanding";
import Index from "./pages/Index"; // Import the Dashboard

function App() {
  return (
    <Routes>
      {/* 1. The Main Dashboard (Now at the root) */}
      <Route path="/" element={<Index />} />

      {/* 2. Adrenaline Landing Page */}
      <Route
        path="/landing/adrenaline-desert"
        element={<AdrenalineLanding />}
      />

      {/* 3. Catch-all for 404s (Optional, redirects back to home) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;