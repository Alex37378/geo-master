import { useState } from "react";
import { geoPath, geoNaturalEarth1 } from "d3-geo";
import { feature } from "topojson-client";
import world from "../data/world.json";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";
import { useEffect, useRef } from "react";
import GameHeader from "../components/GameHeader.jsx";
import GameStats from "../components/GameStats.jsx";
import ClickWorldMap from "../components/ClickWorldMap.jsx";
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

export default function CountryLocator() {

  const location = useLocation();
  const mode = location.state?.mode || "classic";

  const game = useGameLogic(mapCountries, mode, "countryLocator");


  const [mapSettings, setMapSettings] = useState({
    scale: 160,
    translate: [400, 250]
  });

  const projection = geoNaturalEarth1()
  .scale(mapSettings.scale)
  .translate(mapSettings.translate);
  const path = geoPath(projection);
  const svgRef = useRef();

  const [selectedCountry, setSelectedCountry] = useState(null);

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
      const correct =
          selectedCountry?.toString() === 
          game.currentItem?.id?.toString();

      setSelectedCountry(null);

      return correct;
  }

  function handleSkip() {
      setSelectedCountry(null);
      game.skipQuestion();
  }

  function handleReset() {
      setSelectedCountry(null);
      game.resetGame();
  }

  return (

    <div className="relative min-h-screen">
    
      <Background />
    
      <div className="relative z-10">

        <GameHeader 
          resetGame={handleReset} 
          title="Country Locator"
        />

        <div className="space-y-6">

          <div className="border-t border-slate-200"></div>

          <GameStats 
            score={game.score}
            classicHighScore={game.classicHighScore}
            timedHighScore={game.timedHighScore}
            feedback={game.feedback}
            question={game.question}
            msg={`Find ${game.currentItem?.name}`}
            mode={game.mode}
            timeLeft={game.timeLeft}
            timeFeedback={game.timeFeedback}
          />

          <ClickWorldMap 
            svgRef={svgRef}
            countriesGeo={countriesGeo}
            path={path}
            gameOver={game.gameOver}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            wrongCountries={game.wrongItems}
          />

          <p className="text-center text-slate-600">Click directly on the map.</p>

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