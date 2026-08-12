import { Link } from "react-router-dom";
import { useState } from "react";

import img1 from "../images_hub/country_map.jpg"
import img2 from "../images_hub/flag_map.jpg"
import img3 from "../images_hub/capital_map.png"
import img4 from "../images_hub/click_map.png"
import img5 from "../images_hub/famous_landmarks.jpg"
import img6 from "../images_hub/multiplech_quiz.jpg"

import Background from "../components/Background";

export default function Geohub() {

  const [mode, setMode] = useState(
    localStorage.getItem("mode") || "classic"
  );

  const score1 = localStorage.getItem("nameCountry-classic-highscore");
  const score2 = localStorage.getItem("nameCountry-timed-highscore");

  const score3 = localStorage.getItem("nameFlag-classic-highscore");
  const score4 = localStorage.getItem("nameFlag-timed-highscore");

  const score5 = localStorage.getItem("nameCapital-classic-highscore");
  const score6 = localStorage.getItem("nameCapital-timed-highscore");

  const score7 = localStorage.getItem("countryLocator-classic-highscore");
  const score8 = localStorage.getItem("countryLocator-timed-highscore");

  const score9 = localStorage.getItem("landmarkLocator-classic-highscore");
  const score10 = localStorage.getItem("landmarkLocator-timed-highscore");

  const score11 = localStorage.getItem("geoQuiz-classic-highscore");
  const score12 = localStorage.getItem("geoQuiz-timed-highscore");

  return (
    <div className="relative min-h-screen">

        <Background />

        <div className="relative z-10">

          <div className="flex flex-col items-center text-center space-y-4 mb-6">
              <h1 className="font-bold text-3xl mt-6">GeoMaster</h1>

              <p className="text-lg">Learn world geography through fun, interactive quizzes.</p>

              <div>

                <button
                  onClick={() => {
                    setMode("classic");
                    localStorage.setItem("mode", "classic");
                  }}
                  className={`
                    text-[#10B981] rounded-l-lg p-2 border border-[#10B981] cursor-pointer hover:scale-[1.03] font-semibold
                    ${mode === "classic"
                      ? "bg-[#10B981] hover:bg-[#059669] text-white"
                      : "bg-white hover:bg-emerald-50"}
                  `}
                >
                  Classic
                </button>

                <button
                  onClick={() => {
                    setMode("timed");
                    localStorage.setItem("mode", "timed");
                  }}
                  className={`
                    text-[#10B981] rounded-r-lg p-2 border border-[#10B981] cursor-pointer hover:scale-[1.03] font-semibold
                    ${mode === "timed"
                      ? "bg-[#10B981] hover:bg-[#059669] text-white"
                      : "bg-white hover:bg-emerald-50"}
                  `}
                >
                  Timed
                </button>

              </div>
              
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-4 justify-center w-fit mx-auto">
              <Link to="/name-country" state={{mode}}>

                <div className="group w-[calc(100%-2rem)] max-w-[310px] mx-auto hover:-translate-y-1 hover:shadow-lg">
                  <img
                    src={img1}
                    className="w-full h-[200px] object-cover rounded-t-lg border-t border-l border-r border-[#10B981]"
                  />
                  <button className=" w-full rounded-b-lg p-2 bg-[#FFFFFF] border-b border-l border-r border-[#10B981] cursor-pointer group-hover:bg-emerald-50">
                    <div className="text-xl font-semibold">Name the Country</div>
                    <div className="text-base">Classic: {score1 || 0}, Timed: {score2 || 0}</div>
                  </button>
                </div>

              </Link>

              <Link to="/name-flag" state={{mode}}>

                <div className="group w-[calc(100%-2rem)] max-w-[310px] mx-auto hover:-translate-y-1 hover:shadow-lg">
                  <img
                    src={img2}
                    className="w-full h-[200px] object-cover rounded-t-lg border-t border-l border-r border-[#10B981]"
                  />
                  <button className="w-full rounded-b-lg p-2 bg-[#FFFFFF] border-b border-l border-r border-[#10B981] cursor-pointer group-hover:bg-emerald-50">
                    <div className="text-xl font-semibold">Name the Flag</div>
                    <div className="text-base">Classic: {score3 || 0}, Timed: {score4 || 0}</div>
                  </button>

                </div>

              </Link>

              <Link to="/name-capital" state={{mode}}>

                <div className="group w-[calc(100%-2rem)] max-w-[310px] mx-auto hover:-translate-y-1 hover:shadow-lg">
                  <img
                    src={img3}
                    className="w-full h-[200px] object-cover rounded-t-lg border-t border-l border-r border-[#10B981]"
                  />
                  <button className=" w-full rounded-b-lg p-2 bg-[#FFFFFF] border-b border-l border-r border-[#10B981] cursor-pointer group-hover:bg-emerald-50">
                    <div className="text-xl font-semibold">Name the Capital</div>
                    <div className="text-base">Classic: {score5 || 0}, Timed: {score6 || 0}</div>
                  </button>

                </div>

              </Link>

              <Link to="/country-locator" state={{mode}}>

                <div className="group w-[calc(100%-2rem)] max-w-[310px] mx-auto hover:-translate-y-1 hover:shadow-lg">
                  <img
                    src={img4}
                    className="w-full h-[200px] object-cover rounded-t-lg border-t border-l border-r border-[#10B981]"
                  />
                  <button className="w-full rounded-b-lg p-2 bg-[#FFFFFF] border-b border-l border-r border-[#10B981] cursor-pointer group-hover:bg-emerald-50">
                    <div className="text-xl font-semibold">Country Locator</div>
                    <div className="text-base">Classic: {score7 || 0}, Timed: {score8 || 0}</div>
                  </button>
  
                </div>

              </Link>

              <Link to="/landmark-locator" state={{mode}}>

                <div className="group w-[calc(100%-2rem)] max-w-[310px] mx-auto hover:-translate-y-1 hover:shadow-lg">
                  <img
                    src={img5}
                    className="w-full h-[200px] object-cover rounded-t-lg border-t border-l border-r border-[#10B981]"
                  />
                  <button className="w-full rounded-b-lg p-2 bg-[#FFFFFF] border-b border-l border-r border-[#10B981] cursor-pointer group-hover:bg-emerald-50">
                    <div className="text-xl font-semibold">Landmark Locator</div>
                    <div className="text-base">Classic: {score9 || 0}, Timed: {score10 || 0}</div>
                  </button>

                </div>

              </Link>

              <Link to="/geo-quiz" state={{mode}}>

                <div className="group w-[calc(100%-2rem)] max-w-[310px] mx-auto hover:-translate-y-1 hover:shadow-lg mb-5">
                  <img
                    src={img6}
                    className="w-full h-[200px] object-cover rounded-t-lg border-t border-l border-r border-[#10B981]"
                  />
                  <button className=" w-full rounded-b-lg p-2 bg-[#FFFFFF] border-b border-l border-r border-[#10B981] cursor-pointer group-hover:bg-emerald-50">
                    <div className="text-xl font-semibold">Geo Quiz</div>
                    <div className="text-base">Classic: {score11 || 0}, Timed: {score12 || 0}</div>
                  </button>

                </div>

              </Link>
          </div>

        </div>

    </div>
  );
}