import { BrowserRouter, Routes, Route } from "react-router-dom";
import OverlayMain from "./pages/OverlayMain";
import Bracket from "./pages/Bracket";

export default function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path="/overlay" element={<OverlayMain />} />
        <Route path="/bracket" element={<Bracket />} />
      </Routes>
    </BrowserRouter>
  );
}
