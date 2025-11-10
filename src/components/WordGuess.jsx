import { useEffect, useRef, useState } from "react";
import "../css/WordGuess.css"

// word is the word to be guessed
export function WordGuess(
    { 
        word, 
        wordLength, 
        isActive, 
        onCompleteGuess, 
        validWords, 
        gameId,
        isWon,
        checkGuess,
        displayInvalidWordMessage
    }) {
    const [letters, setLetters] = useState(Array(wordLength).fill("")); // this is the guess
    const [guessResult, setGuessResult] = useState(Array(wordLength).fill(""));
    const inputRef = useRef([]);

    useEffect(() => {
        const guess = letters.join("");
        if(guess.length === wordLength && validWords.includes(guess)) {
            const isWon = letters.every((letter, i) => word[i] === letter);
            onCompleteGuess(isWon); // calls father component
            setGuessResult(checkGuess(guess));
        } else if (guess.length === wordLength && !validWords.includes(guess)) {
            displayInvalidWordMessage(guess);
        }
    }, [letters]);

    useEffect(() => {
        setLetters(Array(wordLength).fill(""));
        setGuessResult(Array(wordLength).fill(""));
    }, [gameId]);

    useEffect(() => {
        if (isActive) {
            inputRef.current[0]?.focus();
        }
    }, [isActive]);

    const handleChange = (e, i) => {
        const letter = e.target.value.toUpperCase().slice(0, 1);
        
        const newLetters = [...letters];
        newLetters[i] = letter;
        setLetters(newLetters);

        if(letter && i < wordLength - 1) {
            inputRef.current[i + 1]?.focus();
        }
    }

    const handleKeydown = (e, i) => {
        if(e.key === "Backspace") {
            if(letters[i]) {
                const newLetters = [...letters];
                newLetters[i] = "";
                setLetters(newLetters);
            } else if(i > 0) {
                inputRef.current[i - 1]?.focus();
            }
            displayInvalidWordMessage("");
        }
    }

    return (
        <div className="guess-row">
            {
                letters.map((letter, i) => (
                    <input
                        key={`${gameId}-${i}`}
                        type="text"
                        className={`tile ${guessResult[i]}`}
                        maxLength={1}
                        value={letter}
                        onChange={(e) => handleChange(e, i)}
                        onKeyDown={(e) => handleKeydown(e, i)}
                        ref={el => inputRef.current[i] = el}
                        disabled={!isActive || isWon}
                    />
                ))
            }
        </div>
    )
}

export default WordGuess;