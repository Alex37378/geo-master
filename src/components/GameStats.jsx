export default function GameStats({
    score, 
    classicHighScore,
    timedHighScore,
    feedback, 
    question, 
    msg,
    mode,
    timeLeft,
    timeFeedback
}) {
    return (
    <div>
        <div className="flex flex-row items-center justify-center">
            <p className="text-lg">Score: </p>
            <p className="mx-1 text-[#10B981] text-lg font-semibold">{score}</p>
            <p className="mx-4 text-lg">|</p>
            {mode === "classic" && (
                <div className="flex">
                    <p className="text-lg">Classic High Score: </p>
                    <p className="mx-1 text-[#10B981] text-lg font-semibold">{classicHighScore}</p>
                </div>
            )}
            {mode === "timed" && (
                <div className="flex">
                    <p className="text-lg">Timed High Score: </p>
                    <p className="mx-1 text-[#10B981] text-lg font-semibold">{timedHighScore}</p>
                </div>
            )}
        </div>

        <p className={`h-6 text-center
          ${feedback.startsWith("Correct")
            ? "text-[#10B981]"
            : "text-red-500"}`}>
            {feedback}
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center">
            
            {mode === "classic" ? (
                <p className="text-lg">Question {question} of 20</p> 
            ) : (
                <p className="text-lg">⏱️ Time Left: {timeLeft}s</p> 
            )}
            <p className="hidden sm:block mx-4 text-lg">|</p>
            <p className="text-lg mx-4">{msg}</p>
        </div>

        <p className="h-6 text-center text-[#10B981]">
            {timeFeedback}
        </p>

    </div>
    )
}