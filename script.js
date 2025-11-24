const Gameboard = (function () {
    let board = [];

    //Initialize board
    for (i = 0; i < 3; i++) {
        board.push([[]*3]);
    } 

    const getBoard = () => board;

    const printBoard = () => {

    }

    const updateBoard = (row, column) => {
        
    }

    return { getBoard, printBoard, updateBoard };
})();

function Player (name, token) {
    return { name, token };
}

const GameController = (function () {
    let currentPlayer = "";
    const playerX = Player("Alpha", "X");
    const playerO = Player("Bravo", "O");

    const switchTurn = () => {

    }

    const playRound = () => {

    }

    const checkWin = () => {

    }

    return { switchTurn, playRound, checkWin };
})();