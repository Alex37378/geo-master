import { useState } from "react";
import { geoPath, geoNaturalEarth1 } from "d3-geo";
import { feature } from "topojson-client";
import world from "../data/world.json";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";
import { useEffect, useRef } from "react";
import GameHeader from "../components/GameHeader.jsx";
import GameStats from "../components/GameStats.jsx";
import WorldMap from "../components/WorldMap.jsx";
import Input from "../components/Input.jsx";
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

export default function NameCountry() {

  const location = useLocation();
  const mode = location.state?.mode || "classic";

  const game = useGameLogic(mapCountries, mode, "nameCountry");

  const [mapSettings, setMapSettings] = useState({
    scale: 180,
    translate: [400, 250]
  });

  const projection = geoNaturalEarth1()
  .scale(mapSettings.scale)
  .translate(mapSettings.translate);
  const path = geoPath(projection);
  const currentFeature = getCurrentCountryFeature();
  const svgRef = useRef();

  const [answer, setAnswer] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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

  function getCurrentCountryFeature() {
    return countriesGeo.features.find(
      (country) =>
        country.id?.toString() === game.currentItem?.id?.toString()
    );
  }

  function isSmallCountry(countryFeature) {
    const bounds = path.bounds(countryFeature);

    const width = bounds[1][0] - bounds[0][0];
    const height = bounds[1][1] - bounds[0][1];

    return width < 10 && height < 10;
  }

  function checkAnswer(){
    const correct = answer.trim().toLowerCase() === 
    game.currentItem.name.toLowerCase();

    setAnswer("");
    setSuggestions([]);

    return correct;
  }

  function handleAnswerChange(value) {
        setAnswer(value);

        if (value.trim() === "") {
            setSuggestions([]);
            return;
        }

        let matches;
        matches = mapCountries
            .filter(country =>
                country.name
                .toLowerCase()
                .startsWith(value.toLowerCase())
            )
            .slice(0, 5);

        setSuggestions(matches);
  }

  return (

    <div className="relative z-0 min-h-screen">
    
      <Background />
    
      <div className="relative z-10">

        <GameHeader 
          resetGame={game.resetGame} 
          title="Name the Country"
        />

        <div className="space-y-6 pb-[100px]">

          <div className="border-t border-slate-200"></div>

          <GameStats 
            score={game.score}
            classicHighScore={game.classicHighScore}
            timedHighScore={game.timedHighScore}
            feedback={game.feedback}
            question={game.question}
            msg="Guess the highlighted country."
            mode={game.mode}
            timeLeft={game.timeLeft}
            timeFeedback={game.timeFeedback}
          />

          <WorldMap 
            svgRef={svgRef}
            countriesGeo={countriesGeo}
            path={path}
            gameOver={game.gameOver}
            currentCountry={game.currentItem}
            currentFeature={currentFeature}
            isSmallCountry={isSmallCountry}
            wrongCountries={game.wrongItems}
          />

            <Input 
              answer={answer}
              suggestions={suggestions}
              gameOver={game.gameOver}
              setAnswer={setAnswer}
              setSuggestions={setSuggestions}
              handleAnswerChange={handleAnswerChange}
              checkAnswer={checkAnswer}
              handleResult={game.handleResult}
              thing="country"
            />

            <Buttons 
                checkAnswer={checkAnswer}
                handleResult={game.handleResult}
                gameOver={game.gameOver}
                skipQuestion={game.skipQuestion}
            />

        </div>

      </div>

    </div>
  );
}