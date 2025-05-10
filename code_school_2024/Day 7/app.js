let answer;
let total_words;
let currentGuess = "";
let guesses = [];
let playGame = async () => {
    if (localStorage.getItem("answer")) {
        answer = JSON.parse(localStorage.getItem("answer"));
        total_words = JSON.parse(localStorage.getItem("total_words"));
        guesses = JSON.parse(localStorage.getItem("guesses"));
    } else {
        answer = await getAnswerWord();
        localStorage.setItem("answer", JSON.stringify(answer));
        localStorage.setItem("total_words", JSON.stringify(total_words));
    }
    setUpInputs();
    updateGuesses();
};
let getAnswerWord = async () => {
    let response = await fetch("https://api.jsonbin.io/v3/b/629f9937402a5b38021f6b38");
    let wordJson = await response.json();
    let randomIndex = Math.floor(Math.random() * wordJson.record.answers.length);
    total_words = wordJson.record.allowed.concat(wordJson.record.answers);
    console.log(total_words);
    let answer = wordJson.record.answers[randomIndex];
    return answer;
};
let updateGuesses = () => {
    let guesses_parent_div = document.getElementById("guesses");
    guesses_parent_div.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        let g_child_div = document.createElement("div");
        g_child_div.classList.add("guess");
        guesses_parent_div.appendChild(g_child_div);
        let result;
        if (i < guesses.length) {
            g_child_div.classList.add("guessed");
            result = checkWord(guesses[i]);
        }
        for (let j = 0; j < 5; j++) {
            let letterDiv = document.createElement("div");
            letterDiv.classList.add("letter");
            if (i < guesses.length) {
                letterDiv.innerHTML = guesses[i][j];
                if (result[j] === "green") {
                    letterDiv.classList.add("match");
                } else if (result[j] === "yellow") {
                    letterDiv.classList.add("contains");
                }
            }
            if (i === guesses.length && j < currentGuess.length) {
                letterDiv.innerHTML = currentGuess[j];
            }
            g_child_div.appendChild(letterDiv);
        }
    }
};
let checkWord = (guess) => {
    let result = ["gray", "gray", "gray", "gray", "gray"];
    let answerList = answer.split("");
    for (let i = 0; i < 5; i++) {
        if (answerList[i] === guess[i]) {
            answerList[i] = null;
            result[i] = "green";
        }
    }
    for (let i = 0; i < 5; i++) {
        let index = answerList.indexOf(guess[i]);
        if (index >= 0 && result[i] === "gray") {
            answerList[i] = null;
            result[i] = "yellow";
        }
    }
    return result;
};
let submitGuess = () => {
    let message_div = document.getElementById("message");
    if (currentGuess.length < 5) {
        message_div.innerHTML = "Live, laugh, love as long as it's 5 letters.";
    } else if (!total_words.includes(currentGuess)) {
        message_div.innerHTML = "You think that is a real word? " + "&#129300;";
    } else if (guesses.length < 6) {
        guesses.push(currentGuess);
        localStorage.setItem("guesses", JSON.stringify(guesses));
        if (currentGuess === answer) {
            message_div.innerHTML = "Yippee!";
        } else if (guesses.length === 6) {
            message_div.innerHTML = "Womp Womp :(";
        }
    }
    updateGuesses();
};
let setUpInputs = () => {
    document.onkeydown = (event) => {
        if ("a" <= event.key && event.key <= "z" && currentGuess.length < 5) {
            currentGuess += event.key;
        } else if (event.key === "Backspace" && currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
        } else if (event.key === "Enter") {
            submitGuess();
            currentGuess = "";
        }
        console.log(currentGuess);
        updateGuesses();
    };
};
playGame();