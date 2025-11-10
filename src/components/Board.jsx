import WordGuess from "./WordGuess"

export function Board(
    { 
        wordLength, 
        wordToGuess, 
        currentGuessIndex, 
        handleCompleteGuess, 
        validWords, 
        gameId,
        isWon,
        checkGuess,
        displayInvalidWordMessage,
        handleLetterChange,
        guess
    }) {

    return (
        <div id="board">
            {
                Array(wordLength + 1).fill(null).map((_, i) => (
                    <WordGuess 
                        key={i} 
                        word={wordToGuess} 
                        wordLength={wordLength} 
                        isActive={i === currentGuessIndex}
                        onCompleteGuess={handleCompleteGuess}
                        validWords={validWords}
                        gameId={gameId}
                        isWon={isWon}
                        checkGuess={checkGuess}
                        displayInvalidWordMessage={displayInvalidWordMessage}
                        handleLetterChange={handleLetterChange}
                        guess={guess}
                        guessIndex={i}
                    />
                ))
            }
        </div>
    )
}

export default Board;