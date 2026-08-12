import { BrowserRouter, Routes, Route } from "react-router-dom";

import Geohub from "./games/Geohub";
import NameCountry from "./games/NameCountry";
import NameFlag from "./games/NameFlag";
import NameCapital from "./games/NameCapital";
import CountryLocator from "./games/CountryLocator";
import LandmarkLocator from "./games/LandmarkLocator";
import GeoQuiz from "./games/GeoQuiz";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#EFF6FF]">
        <Routes>
          <Route path="/" element={<Geohub />} />
          <Route path="/name-country" element={<NameCountry />} />
          <Route path="/name-flag" element={<NameFlag />} />
          <Route path="/name-capital" element={<NameCapital />} />
          <Route path="/country-locator" element={<CountryLocator />} />
          <Route path="/landmark-locator" element={<LandmarkLocator />} />
          <Route path="/geo-quiz" element={<GeoQuiz />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}