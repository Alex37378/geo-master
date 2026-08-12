export default function Input({
    answer, 
    suggestions, 
    gameOver, 
    setAnswer, 
    setSuggestions,
    handleAnswerChange,
    checkAnswer,
    handleResult,
    thing
}){
    return (
    <div className="flex flex-col items-center space-y-6">

          <div className="relative">
            <input
              type="text"
              value={answer}
              onChange={(e)=>handleAnswerChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !gameOver) {
                  const correct = checkAnswer();
                  handleResult(correct);
                }
              }}
              disabled={gameOver}
              placeholder={`Type ${thing} here`}
              className="p-2 rounded-lg bg-white focus:outline-none border border-white focus:border-[#10B981] disabled:cursor-not-allowed"
              onBlur={() => setSuggestions([])}
            />

            {suggestions.length > 0 && (
              <div className=" w-full absolute bg-white border border-[#10B981] rounded-md ">
                {suggestions.map(country => (
                  <div
                    key={country.id}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setAnswer(country.name);
                      setSuggestions([]);
                    }}
                    className="cursor-pointer px-3 py-1"
                  >
                    {country.name}
                  </div>
                ))}
              </div>
            )}
          </div>
    </div>
    )
}