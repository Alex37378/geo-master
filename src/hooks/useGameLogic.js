import { useState, useEffect, useRef } from "react";

export default function useGameLogic(items, mode = "classic", gameName) {

    const [score, setScore] = useState(0);

    const [classicHighScore, setClassicHighScore] = useState(
        Number(localStorage.getItem(`${gameName}-classic-highscore`)) || 0
    );
    const [timedHighScore, setTimedHighScore] = useState(
        Number(localStorage.getItem(`${gameName}-timed-highscore`)) || 0
    );

    const [question, setQuestion] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [streak, setStreak] = useState(0);
    const [wrongItems, setWrongItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shuffledItems, setShuffledItems] = useState([]);
    const [timeLeft, setTimeLeft] = useState(60);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [timeFeedback, setTimeFeedback] = useState("");
    const scoreRef = useRef(0);

    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    useEffect(() => {
        if (mode !== "timed" || gameOver) return;

        const interval = setInterval(() => {

            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    endGame(scoreRef.current);
                    return 0;
                }
                return prev - 1;
            });

        }, 1000);

        return () => clearInterval(interval);
    }, [mode, gameOver]);

    useEffect(() => {
        setShuffledItems(shuffle(items));
        setCurrentIndex(0);
    }, [items]);

    function completeQuestion(newScore) {

        if (mode === "classic") {

            if (question === 20) {

                endGame(newScore);
                return;
            }
        }
        nextQuestion();
    }

    function handleResult(correct) {
        if (gameOver) return;

        let newScore = score;
        let nextCorrectAnswers;

        if (correct) {
            const bonus = streak * 10;
            newScore += 100 + bonus;

            setStreak(prev => prev + 1);
            setFeedback(
                `Correct! +${100 + bonus} ${
                    streak > 0 ? ` (${streak} Streak)` : ""
                }`
            );
            nextCorrectAnswers = correctAnswers + 1;
            setCorrectAnswers(nextCorrectAnswers);
        }
        else {
            newScore = Math.max(0, newScore - 30);

            setFeedback(`Incorrect. -30`);
            setStreak(0);

            setWrongItems(prev => [
                ...prev,
                currentItem
            ]);
        }
        setScore(newScore);
        completeQuestion(newScore);

        if (mode === "timed" && nextCorrectAnswers % 5 === 0) {
            setTimeLeft(time => time + 3);
            setTimeFeedback("+3 seconds");
        }
        else {
            setTimeFeedback("");
        }
    }

    function nextQuestion() {
        setQuestion(prev => prev + 1);

        if (currentIndex >= shuffledItems.length - 1) {
            setShuffledItems(shuffle(items));
            setCurrentIndex(0);
        }
        else {
            setCurrentIndex(prev => prev + 1);
        }
    }

    function skipQuestion() {
        setFeedback("");
        setTimeFeedback("");
        setStreak(0);

        setWrongItems(prev => [
            ...prev,
            currentItem
        ]);

        if (gameOver) return;

        if (mode === "classic" && question === 20) {

            endGame(score);
            return;
        }

        nextQuestion();
    }

    function endGame(finalScore = score) {

        if (mode === "classic") {
            if (finalScore > classicHighScore) {
                setClassicHighScore(finalScore);

                localStorage.setItem(
                    `${gameName}-classic-highscore`,
                    finalScore
                );
            }
        }
        if (mode === "timed") {
            if (finalScore > timedHighScore) {
                setTimedHighScore(finalScore);

                localStorage.setItem(
                    `${gameName}-timed-highscore`,
                    finalScore
                );
            }
        }
        setGameOver(true);
    }

    function resetGame() {
        setScore(0);
        setQuestion(1);
        setGameOver(false);
        setFeedback("");
        setTimeFeedback("");
        setWrongItems([]);
        setStreak(0);

        setShuffledItems(shuffle(items));
        setCurrentIndex(0);

        setTimeLeft(60);
        setCorrectAnswers(0);
    }

    function shuffle(array) {
        const copy = [...array];

        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }

        return copy;
    }

    const currentItem = shuffledItems[currentIndex];

    return {
        score,
        classicHighScore,
        timedHighScore,
        question,
        gameOver,
        feedback,
        timeFeedback,
        wrongItems,
        currentItem,
        timeLeft,
        mode,

        handleResult,
        completeQuestion,
        nextQuestion,
        skipQuestion,
        endGame,
        resetGame,
        shuffle,
    };
}