export default function Buttons({ 
    checkAnswer,
    handleResult,
    gameOver,
    skipQuestion
}) {
    return (
    <div className="flex gap-3 justify-center pb-5">
                <button
                    onClick={() => {
                        const correct = checkAnswer();
                        handleResult(correct);
                    }}
                    disabled={gameOver}
                    className="font-semibold rounded-lg bg-[#10B981] text-white px-4 py-2 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.05] hover:bg-[#059669] hover:shadow-lg"
                >
                Submit
                </button>

                <button 
                onClick={skipQuestion} 
                disabled={gameOver} 
                className="font-semibold rounded-lg bg-[#D3D3D3] px-3 py-2 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.05] hover:bg-[#BEBEBE] hover:shadow-lg"
                >
                Skip →
                </button>
    </div>
    )
}