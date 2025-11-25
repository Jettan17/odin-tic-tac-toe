const Gameboard = (function () {
    let board = [];

    //Initialize board
    for (i = 0; i < 3; i++) {
        board.push(["", "", ""]);
    } 

    const getBoard = () => board;

    const printBoard = () => {
        for (row of board) {
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

    const switchTurn = () => {
        currentPlayer = (currentPlayer === playerX) ? playerO : playerX;
    }

    const getGameState = () => {
        let gameState = "Running";

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

        return gameState;
    }

    const playRound = () => {
        console.log(`${currentPlayer.name}'s turn`);
        Gameboard.printBoard();
        let rowInput = prompt("Enter row (0-2): ");
        let columnInput = prompt("Enter column (0-2): ");

        //Validation
        const currentBoard = Gameboard.getBoard();
        while (!(rowInput in [0, 1, 2]) || !(columnInput in [0, 1, 2]) || currentBoard[rowInput][columnInput] !== "") {
            //Feedback
            if (!(rowInput in [0, 1, 2]) || !(columnInput in [0, 1, 2])) {
                console.log("Invalid cell!");
            } else if (currentBoard[rowInput][columnInput] !== "") {
                console.log("Already filled cell!");
            }

            rowInput = prompt("Enter row (0-2): ");
            columnInput = prompt("Enter column (0-2): ");
        }

        Gameboard.updateBoard(rowInput, columnInput, currentPlayer.token);
    }

    const runGame = () => {
        while (true) {
            playRound();

            const gameState = getGameState();
            if (gameState === "Running") {
                switchTurn();
            } else if (gameState === "Tie") {
                console.log("Game End");
                Gameboard.printBoard();
                console.log("Tie!");
                return;
            } else if (gameState === "Win") {
                console.log("Game End");
                Gameboard.printBoard();
                console.log(`${currentPlayer.name} won!`);
                return;
            }
        }
    }

    return { runGame };
})();

GameController.runGame();