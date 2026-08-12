import { useState } from "react";
import GameHeader from "../components/GameHeader.jsx";
import GameStats from "../components/GameStats.jsx";
import Input from "../components/Input.jsx";
import Buttons from "../components/Buttons.jsx";
import useGameLogic from "../hooks/useGameLogic.js";
import countryData from "../data/countries.json";
import { useLocation } from "react-router-dom";

import Background from "../components/Background";

export default function NameFlag() {

  const location = useLocation();
  const mode = location.state?.mode || "classic";

  const game = useGameLogic(countryData, mode, "nameFlag");
  

  const [answer, setAnswer] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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
        matches = countryData
            .filter(country =>
                country.name
                .toLowerCase()
                .startsWith(value.toLowerCase())
            )
            .slice(0, 5);

        setSuggestions(matches);
  }

  return (

    <div className="relative min-h-screen">
    
      <Background />
    
      <div className="relative z-10">

        <GameHeader 
          resetGame={game.resetGame}
          title="Name the Flag"
        />

        <div className="space-y-6">

          <div className="border-t border-slate-200"></div>

          <GameStats 
            score={game.score}
            classicHighScore={game.classicHighScore}
            timedHighScore={game.timedHighScore}
            feedback={game.feedback}
            question={game.question}
            msg="Guess the flag shown."
            mode={game.mode}
            timeLeft={game.timeLeft}
            timeFeedback={game.timeFeedback}
          />

          <div className="flex justify-center">
            {game.currentItem && (
              <img
                src={game.currentItem.flag}
                alt={`flag`}
                className="w-80 h-52 object-cover rounded-lg"
              />
            )}
          </div>

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

          {game.gameOver && game.wrongItems.length > 0 && (
            <div className="mt-10 pb-5">
              <h2 className="text-2xl font-semibold underline text-center mb-4">
                Review
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 w-fit mx-auto">
                {game.wrongItems.map(country => (
                  <div className="text-center">
                    <img
                      src={country.flag}
                      alt={`flag`}
                      className="w-24 h-16 object-contain mx-auto"
                    />

                    <p className="mt-2 text-sm">
                      {country.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}