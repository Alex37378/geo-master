import { useState } from "react"; 
import { geoPath, geoNaturalEarth1 } from "d3-geo";
import { feature } from "topojson-client";
import world from "../data/world.json";
import landmarks from "../data/landmarks.json";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";
import { useEffect, useRef } from "react";
import GameHeader from "../components/GameHeader.jsx";
import GameStats from "../components/GameStats.jsx";
import ClickLandmarkMap from "../components/ClickLandmarkMap.jsx";
import Buttons from "../components/Buttons.jsx";
import useGameLogic from "../hooks/useGameLogic.js";
import { useLocation } from "react-router-dom";

import Background from "../components/Background";

const countriesGeo = feature(
    world,
    world.objects.countries
);

const mapCountries = countriesGeo.features
  .filter(country => country.id)
  .map(country => ({
    id: country.id,
    name: country.properties.name
  }));

const mappedLandmarks = landmarks
    .map(site => ({
            ...site,
            id: site.id,
            name: site.name,
            wiki: site.wiki,
            coordinates: [
                site.lng,
                site.lat
            ]
    }));

export default function LandmarkLocator() {

  const location = useLocation();
  const mode = location.state?.mode || "classic";

  const game = useGameLogic(mappedLandmarks, mode, "landmarkLocator");


  const [mapSettings, setMapSettings] = useState({
    scale: 160,
    translate: [400, 250]
  });

  const projection = geoNaturalEarth1()
  .scale(mapSettings.scale)
  .translate(mapSettings.translate);
  const path = geoPath(projection);
  const svgRef = useRef();

  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const svg = select(svgRef.current);

    const zoomBehavior = zoom()
      .scaleExtent([1, 5])
      .on("zoom", (event) => {
        svg.select(".map-group")
          .attr("transform", event.transform);
      });

    svg.call(zoomBehavior);
  }, []);

  function checkAnswer() {
      if (!selectedPoint || !game.currentItem) return false;

      const distance = getDistance(
          selectedPoint,
          game.currentItem.coordinates
      );

      setSelectedPoint(null);

      return distance <= 300;
  }

  function getDistance(point1, point2) {

      const [lon1, lat1] = point1;
      const [lon2, lat2] = point2;

      const toRadians = degrees => degrees * Math.PI / 180;

      const R = 6371; // Earth's radius in km

      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);

      const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
      );

      return R * c;
  }

  function handleSkip() {
      setSelectedPoint(null);
      game.skipQuestion();
  }

  function handleReset() {
      setSelectedPoint(null);
      game.resetGame();
  }

  return (

    <div className="relative min-h-screen">
    
      <Background />
    
      <div className="relative z-10">

        <GameHeader 
          resetGame={handleReset} 
          title="Landmark Locator"
        />

        <div className="space-y-6">

          <div className="border-t border-slate-200"></div>

          <GameStats 
            score={game.score}
            classicHighScore={game.classicHighScore}
            timedHighScore={game.timedHighScore}
            feedback={game.feedback}
            question={game.question}
            msg={`Find the ${game.currentItem?.name}`}
            mode={game.mode}
            timeLeft={game.timeLeft}
            timeFeedback={game.timeFeedback}
          />

          <div className="relative w-[calc(100%-2rem)] max-w-[800px] mx-auto">

            {game.currentItem &&  (
              <img
                src={`/landmarks/${game.currentItem.id}.jpg`}
                alt={game.currentItem.name}
                onClick={() => setShowImage(true)}
                className="absolute top-1 left-1 w-[22%] h-auto aspect-[3/2] object-cover rounded-lg border-2 border-white cursor-pointer hover:scale-[1.03] hover:brightness-105"
              />
            )}

            {showImage && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    onClick={() => setShowImage(false)}
                >
                    <img
                        src={`/landmarks/${game.currentItem.id}.jpg`}
                        className="max-w-5xl max-h-[90vh] rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <ClickLandmarkMap 
              svgRef={svgRef}
              countriesGeo={countriesGeo}
              path={path}
              projection={projection}
              gameOver={game.gameOver}
              selectedPoint={selectedPoint}
              setSelectedPoint={setSelectedPoint}
              wrongLandmarks={game.wrongItems}
            />

          </div>

          <p className="text-center text-slate-600">Click directly on the map. Must be within 300 km of landmark.</p>

          <Buttons 
              checkAnswer={checkAnswer}
              handleResult={game.handleResult}
              gameOver={game.gameOver}
              skipQuestion={handleSkip}
          />

        </div>
      
      </div>

    </div>
  );
}