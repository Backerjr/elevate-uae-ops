import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdrenalineLanding from "./pages/AdrenalineLanding";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/landing/adrenaline-desert"
          element={<AdrenalineLanding />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
