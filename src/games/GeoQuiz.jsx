import GameHeader from "../components/GameHeader.jsx";
import GameStats from "../components/GameStats.jsx";
import Input from "../components/Input.jsx";
import Buttons from "../components/Buttons.jsx";
import useGameLogic from "../hooks/useGameLogic.js";
import questions from "../data/questions.json";
import { useLocation } from "react-router-dom";

import Background from "../components/Background";

export default function GeoQuiz() {

  const location = useLocation();
  const mode = location.state?.mode || "classic";

  const game = useGameLogic(questions, mode, "geoQuiz");


  function checkAnswer(option){
    const correct = 
    option.toLowerCase() === game.currentItem.answer.toLowerCase();

    game.handleResult(correct)
  }

  return (

    <div className="relative min-h-screen">
    
      <Background />
    
      <div className="relative z-10">

        <GameHeader
          resetGame={game.resetGame}
          title="Geo Quiz"
        />

        <div className="space-y-6">

          <div className="border-t border-slate-200"></div>

          <GameStats 
            score={game.score}
            classicHighScore={game.classicHighScore}
            timedHighScore={game.timedHighScore}
            feedback={game.feedback}
            question={game.question}
            msg={game.currentItem?.question}
            mode={game.mode}
            timeLeft={game.timeLeft}
            timeFeedback={game.timeFeedback}
          />

          <div className="flex flex-col gap-4 max-w-xs mx-auto">
              {game.currentItem?.options.map((option) => (
                  <button
                      key={option}
                      onClick={() => checkAnswer(option)}
                      className="
                          w-[calc(100%-2rem)]
                          h-16
                          rounded-xl
                          border-2
                          border-[#10B981]
                          bg-white
                          font-semibold
                          text-lg
                          text-[#10B981]
                          hover:bg-[#10B981]
                          hover:text-white
                          hover:cursor-pointer
                          transition
                          hover:shadow-lg
                          hover:scale-[1.05]
                          disabled:cursor-not-allowed
                          mx-auto
                      "
                      disabled={game.gameOver}
                  >
                      {option}
                  </button>
              ))}
          </div>

          <button 
              onClick={game.skipQuestion} 
              disabled={game.gameOver} 
              className="font-semibold flex mx-auto rounded-lg bg-[#D3D3D3] px-3 py-2 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.05] hover:bg-[#BEBEBE] hover:shadow-lg"
          >
              Skip →
          </button>

          {game.gameOver && game.wrongItems.length > 0 && (
            <div className="mt-10">

              <h2 className="text-2xl underline font-semibold text-center mb-4">
                Review
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto pb-5">
                {game.wrongItems.map(questionObj => (
                  <div className="bg-white border border-red-500 rounded-lg p-2 mx-4 text-center">

                    <p>❓ {questionObj.question}</p>
                    <p>✅ {questionObj.answer}</p>
                    <p></p>
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