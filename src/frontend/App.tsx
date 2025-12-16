import { Routes, Route } from "react-router-dom";
import AdrenalineLanding from "./pages/AdrenalineLanding";

function App() {
  return (
    <Routes>
      <Route
        path="/landing/adrenaline-desert"
        element={<AdrenalineLanding />}
      />
    </Routes>
  );
}

export default App;
