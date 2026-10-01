export async function fetchValidWords() {
    try {
        const response = await fetch("/data/words.txt");
        const text = await response.text();

        const words = text.split("\n").map(word => word.trim().toUpperCase());

        return words;
    } catch(error) {
        console.error("Can't fetch common_words.txt", error);
        return [];
    }
}

export async function fetchWordToGuess() {
    try {
        const response = await fetch("/data/common_words.txt");
        const text = await response.text();

        const words = text.split("\n").map(word => word.trim().toUpperCase());
        const randomWord = words[Math.floor(Math.random() * words.length)];

        return randomWord;
    } catch(error) {
        console.error("Can't fetch common_words.txt", error);
        return "";
    }
}

