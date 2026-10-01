import { fetchWordToGuess, fetchValidWords } from "../services/api.js"
import Board from "./Board.jsx"
import { useState, useEffect, useCallback } from "react"

const focusLastGuessLetter = () => {
    document.querySelector("#board .guess-row input:not(:disabled):last-child")?.focus();
}

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

    const resetGame = useCallback(async () => {
        setWordToGuess(await fetchWordToGuess());
        setCurrentGuessIndex(0);
        setIsWon(false);
        setIsLost(false);
        setInvalidGuess("");
        setGameId(prev => prev + 1);
    }, []);

    useEffect(() => {
        const initGame = async () => {
            const words = await fetchValidWords();
            setValidWords(words);
            const randomWord = await fetchWordToGuess();
            setWordToGuess(randomWord);
        }

        initGame();
    }, [])

    useEffect(() => {
        if (!invalidGuess && !isWon && !isLost) return;

        const handleKeyDown = (event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            if (invalidGuess) {
                setInvalidGuess("");
                requestAnimationFrame(focusLastGuessLetter);
            } else {
                resetGame();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [invalidGuess, isWon, isLost, resetGame]);

    // Used for Debugging Only
    useEffect(() => {
        console.log(wordToGuess);
    }, [wordToGuess])

    const checkGuess = (guess) => {
        const result = Array(wordLength).fill("wrong");

        const availableLetters = {};

        for (let i = 0; i < wordLength; i++) {
            if (guess[i] === wordToGuess[i]) {
                result[i] = "right";
            } else {
                availableLetters[wordToGuess[i]] = (availableLetters[wordToGuess[i]] || 0) + 1;
            }
        }

        for (let i = 0; i < wordLength; i++) {
            if (result[i] !== "right" && availableLetters[guess[i]] > 0) {
                result[i] = "present";
                availableLetters[guess[i]]--;
            }
        }

        return result;
    }

    const handleCompleteGuess = (gameWon) => {
        if (gameWon) {
            setIsWon(true);
            setWins(prev => prev + 1);
        } else if (currentGuessIndex === wordLength) {
            setIsLost(true);
            setLosses(prev => prev + 1);
        }
        setCurrentGuessIndex(prev => prev + 1);
    }

    const displayInvalidWordMessage = (guess) => {
        setInvalidGuess(guess);
    }

    const dismissInvalidGuess = () => {
        setInvalidGuess("");
        requestAnimationFrame(focusLastGuessLetter);
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
            {(invalidGuess || isWon || isLost) && (
                <div className="game-modal-backdrop">
                    <section
                        className="game-modal"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="game-modal-message"
                    >
                        <p id="game-modal-message">
                            {invalidGuess
                                ? `The word ${invalidGuess} does not exist`
                                : isWon
                                    ? "You won the game!"
                                    : "You lost the game."}
                        </p>
                        {invalidGuess ? (
                            <button type="button" onClick={dismissInvalidGuess}>OK</button>
                        ) : (
                            <button type="button" onClick={resetGame}>NEW WORDLE</button>
                        )}
                    </section>
                </div>
            )}
            <button id="generate-new-word-btn" onClick={resetGame}>NEW WORDLE</button>
        </div>
    )
}

export default Wordle;