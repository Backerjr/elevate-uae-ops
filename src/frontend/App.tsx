import { Routes, Route, Navigate } from "react-router-dom";
import AdrenalineLanding from "./pages/AdrenalineLanding";

function App() {
  return (
    <Routes>
      {/* Redirect root to landing */}
      <Route path="/" element={<Navigate to="/landing/adrenaline-desert" replace />} />

      {/* Adrenaline Landing */}
      <Route
        path="/landing/adrenaline-desert"
        element={<AdrenalineLanding />}
      />
    </Routes>
  );
}

export default App;