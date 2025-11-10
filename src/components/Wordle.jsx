import { fetchWordToGuess, fetchValidWords } from "../services/api.js"
import  Board from "./Board.jsx"
import { useState, useEffect } from "react"


export function Wordle() {
    const wordLength = 5;

    const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
    const [wordToGuess, setWordToGuess] = useState("");
    const [validWords, setValidWords] = useState([]);
    const [gameId, setGameId] = useState(0);

    const [invalidGuess, setInvalidGuess] = useState("");

    // handle game wins or losses
    const [isWon, setIsWon] = useState(false);
    const [isLost, setIsLost] = useState(false);
    const [wins, setWins] = useState(0);
    const [losses, setLosses] = useState(0);

    const resetGame = async () => {
        setWordToGuess(await fetchWordToGuess());
        setCurrentGuessIndex(0);
        setIsWon(false);
        setIsLost(false)
        setGameId(prev => prev + 1);
    }

    useEffect(() => {
        const initGame = async () => {
            const words = await fetchValidWords();
            setValidWords(words);
            const randomWord = await fetchWordToGuess();
            setWordToGuess(randomWord);
        }

        initGame();
    }, [])

    // Used for Debugging Only
    useEffect(() => {
        console.log(wordToGuess);
    }, [wordToGuess])

    const checkGuess = (guess) => {
        const newGuess = Array(wordLength).fill("");

        for(let i = 0; i < wordLength; i++){
            if(wordToGuess[i] === guess[i]) {
                newGuess[i] = "right";
            } else if(wordToGuess.includes(guess[i])) {
                newGuess[i] = "present";
            } else {
                newGuess[i] = "wrong";
            }
        }

        return newGuess;
    }

    const handleCompleteGuess = (gameWon) => {
        if(gameWon) {
            setIsWon(true);
            setWins(prev => prev + 1);
        } else if(currentGuessIndex === wordLength) {
            setIsLost(true);
            setLosses(prev => prev + 1);
        }
        setCurrentGuessIndex(prev => prev + 1);
    }

    const displayInvalidWordMessage = (guess) => {
        setInvalidGuess(guess);
    }

    if (!wordToGuess || !validWords) return <p>Loading...</p>;
    return (
        <div className="game-area">
            <p>{`Wins: ${wins}, Losses: ${losses}`}</p>
            <Board 
                wordLength={wordLength}
                wordToGuess={wordToGuess}
                currentGuessIndex={currentGuessIndex}
                setCurrentGuessIndex={setCurrentGuessIndex}
                handleCompleteGuess={handleCompleteGuess}
                validWords={validWords}
                gameId={gameId}
                resetGame={resetGame}
                isWon={isWon}
                checkGuess={checkGuess}
                displayInvalidWordMessage={displayInvalidWordMessage}
            />
            {invalidGuess && <p>The word {invalidGuess} does not exist</p>}
            {isWon && <p>You won the game!</p>}
            {isLost && <p>You Lost the game</p>}
            <button id="generate-new-word-btn" onClick={resetGame}>NEW WORDLE</button>
        </div>
    )
}

export default Wordle;