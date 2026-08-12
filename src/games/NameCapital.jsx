import { useState } from "react";
import { geoPath, geoNaturalEarth1 } from "d3-geo";
import { feature } from "topojson-client";
import world from "../data/world.json";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";
import { useEffect, useRef } from "react";
import GameHeader from "../components/GameHeader.jsx";
import GameStats from "../components/GameStats.jsx";
import CapitalMap from "../components/CapitalMap.jsx";
import Input from "../components/Input.jsx";
import Buttons from "../components/Buttons.jsx";
import useGameLogic from "../hooks/useGameLogic.js";
import countries from "../data/countries.json";
import { useLocation } from "react-router-dom";

import Background from "../components/Background";

const countriesGeo = feature(
    world,
    world.objects.countries
);

const capitalCountries = countriesGeo.features.flatMap(country => {

   if (!country.id) return [];

  const match = countries.find(
      c => c.id.toString() === country.id.toString()
  );
  if (!match?.coordinates) return [];

  return [{
    id: country.id,
    name: country.properties.name,
    capital: match.capital,
    coordinates: match.coordinates
  }];
})

export default function NameCapital() {

  const location = useLocation();
  const mode = location.state?.mode || "classic";

  const game = useGameLogic(capitalCountries, mode, "nameCapital");


  const [mapSettings, setMapSettings] = useState({
    scale: 160,
    translate: [400, 250]
  });

  const projection = geoNaturalEarth1()
  .scale(mapSettings.scale)
  .translate(mapSettings.translate);
  const path = geoPath(projection);
  const svgRef = useRef();
  const currentFeature = getCurrentCountryFeature();

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

  function checkAnswer(){
    const correct = answer.trim().toLowerCase() === 
    game.currentItem.capital.toLowerCase();

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
        matches = countries
            .filter(country =>
                country.capital
                .toLowerCase()
                .startsWith(value.toLowerCase())
            )
            .map(country => ({
                id: country.id,
                name: country.capital
            }))
            .slice(0, 5);

        setSuggestions(matches);
  }

  return (

    <div className="relative min-h-screen">
    
      <Background />
    
      <div className="relative z-10">

        <GameHeader 
          resetGame={game.resetGame} 
          title="Name the Capital"
        />

        <div className="space-y-6">

          <div className="border-t border-slate-200"></div>

          <GameStats 
            score={game.score}
            classicHighScore={game.classicHighScore}
            timedHighScore={game.timedHighScore}
            feedback={game.feedback}
            question={game.question}
            msg="Guess the highlighted capital."
            mode={game.mode}
            timeLeft={game.timeLeft}
            timeFeedback={game.timeFeedback}
          />

          <CapitalMap 
              svgRef={svgRef}
              countriesGeo={countriesGeo}
              path={path}
              projection={projection}
              currentCapital={game.currentItem}
              currentFeature={currentFeature}
              wrongCapitals={game.wrongItems}
              gameOver={game.gameOver}
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
              thing="capital"
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