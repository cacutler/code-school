let player = 1;
let gameOver = false;
let turn_span = document.getElementById("turn");
let tiles = document.querySelectorAll(".tile");
let winner_div = document.getElementById("winner");
let player_h2 = document.getElementById("player");
let isWinner = (player) => {
    let winning_classes = ["row1", "row2", "row3", "col1", "col2", "col3", "diag1", "diag2"];
    let winner = false;
    winning_classes.forEach((win_class) => {
        let selector = "." + player + "." + win_class;
        let player_tiles = document.querySelectorAll(selector);
        if (player_tiles.length === 3) {
            winner = true;
        }
    });
    return winner;
};
tiles.forEach((tile) => {
    tile.onclick = () => {
        if (tile.innerHTML === "" && player === 1 && !gameOver) {
            console.log(tile);
            tile.innerHTML = "X";
            tile.classList.add("x");
            player = 0;
            turn_span.innerHTML = "O";
            if (isWinner("x")) {
                gameOver = true;
                winner_div.innerHTML = "Player X Wins!";
                turn_span.innerHTML = "";
                player_h2.innerHTML = "";
                winner_div.classList.add("x");
            }
            tile.style.cursor = "not-allowed";
        }
        if (tile.innerHTML === "" && player === 0 && !gameOver) {
            console.log(tile);
            tile.innerHTML = "O";
            tile.classList.add("o");
            player = 1;
            turn_span.innerHTML = "X";
            if (isWinner("o")) {
                gameOver = true;
                winner_div.innerHTML = "Player O Wins!";
                turn_span.innerHTML = "";
                player_h2.innerHTML = "";
                winner_div.classList.add("o");
            }
            tile.style.cursor = "not-allowed";
        }
    };
});