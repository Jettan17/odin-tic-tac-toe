const Gameboard = (function () {
    let board = [];

    //Initialize board
    for (let i = 0; i < 3; i++) {
        board.push(["", "", ""]);
    } 

    const getBoard = () => board;

    const printBoard = () => {
        for (const row of board) {
            console.log(row);
        }
        console.log("\n");
    }

    const updateBoard = (row, column, token) => {
        board[row][column] = token;
    }

    return { getBoard, printBoard, updateBoard };
})();

function Player (name, token) {
    return { name, token };
}

const GameController = (function () {
    const playerX = Player("Alpha", "X");
    const playerO = Player("Bravo", "O");
    let currentPlayer = playerX;
    let gameState = "Running";

    const switchTurn = () => {
        currentPlayer = (currentPlayer === playerX) ? playerO : playerX;
    }

    const updateGameState = () => {
        const currentBoard = Gameboard.getBoard();
        
        //Check if tie
        let tie = true;
        for (const row of currentBoard) {
            for (const cell of row) {
                if (cell === "") {
                    tie = false;
                }
            }
        }

        if (tie) {
            gameState = "Tie";
        }

        //Check if won
        const winConfigs = Object.freeze([
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]]);

        for (const config of winConfigs) {
            const cell1 = config[0];
            const cell2 = config[1];
            const cell3 = config[2];

            const token1 = currentBoard[cell1[0]][cell1[1]];
            const token2 = currentBoard[cell2[0]][cell2[1]];
            const token3 = currentBoard[cell3[0]][cell3[1]];

            if (token1 !== "" && token1 === token2 && token2 === token3) {
                gameState = "Win";
            }
        }

        return;
    }

    const playRound = (rowInput, columnInput) => {
        console.log(`${currentPlayer.name}'s turn`);
        Gameboard.updateBoard(rowInput, columnInput, currentPlayer.token);
    }

    const runGame = () => {
        Gameboard.printBoard();
        updateGameState();
        ScreenController.updateScreen();
        
        if (gameState === "Running") {
            switchTurn();
        } else if (gameState === "Tie") {
            console.log("Game End");
            console.log("Tie!");
            return;
        } else if (gameState === "Win") {
            console.log("Game End");
            console.log(`${currentPlayer.name} won!`);
            return;
        }
    }

    const getGameState = () => gameState;
    const getCurrentPlayer = () => currentPlayer;

    return { getCurrentPlayer, getGameState, playRound, runGame };
})();

const ScreenController = (function () {
    const updateScreen = () => {
        //update cells
        const currentBoard = Gameboard.getBoard();

        for (let i = 0; i < 9; i++) {
            const cell = document.getElementById(`cell${i}`);
            cell.textContent = currentBoard[Math.floor(i / 3)][i % 3];
        }

        //update ui
        const turnFeedback = document.getElementById("turn-feedback");
        turnFeedback.textContent = `${GameController.getCurrentPlayer().name}'s turn`;

        const gameEndFeedback = document.getElementById("game-end-feedback");
        if (GameController.getGameState() === "Win") {
            gameEndFeedback.textContent = `${GameController.getCurrentPlayer().name} won!`;
        } else if (GameController.getGameState() === "Tie") {
            gameEndFeedback.textContent = "Tie!";
        }
    }

    const cellUpdated = (e) => {
        if (e.target.textContent === "") {
            if (GameController.getGameState() === "Running") {
                const no = e.target.id.split("cell")[1];
                GameController.playRound(Math.floor(no / 3), no % 3);
                GameController.runGame();
            }
        }
    }
    
    return { updateScreen, cellUpdated };
})();

for (const cell of document.getElementsByClassName("cell")) {
    cell.addEventListener("click", ScreenController.cellUpdated);
}