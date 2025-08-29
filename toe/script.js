

// Gameboard Module
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setCell, reset };
})();

// Player Factory
const Player = (name, marker) => {
  return { name, marker };
};

// Game Controller Module
const GameController = (() => {
  let player1;
  let player2;
  let currentPlayer;
  let gameOver = false;

  const startGame = (name1, name2) => {
    player1 = Player(name1 || "Player 1", "X");
    player2 = Player(name2 || "Player 2", "O");
    currentPlayer = player1;
    gameOver = false;
    Gameboard.reset();
    DisplayController.renderBoard();
    DisplayController.setMessage(`${currentPlayer.name}'s turn`);
  };

  const handleMove = (index) => {
    if (gameOver || !Gameboard.setCell(index, currentPlayer.marker)) return;

    DisplayController.renderBoard();

    if (checkWin(currentPlayer.marker)) {
      DisplayController.setMessage(`${currentPlayer.name} wins!`);
      gameOver = true;
    } else if (checkTie()) {
      DisplayController.setMessage(`It's a tie!`);
      gameOver = true;
    } else {
      switchPlayer();
      DisplayController.setMessage(`${currentPlayer.name}'s turn`);
    }
  };

  const checkWin = (marker) => {
    const winCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winCombos.some(combo =>
      combo.every(index => Gameboard.getBoard()[index] === marker)
    );
  };

  const checkTie = () => {
    return Gameboard.getBoard().every(cell => cell !== "");
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const restart = () => {
    startGame(player1.name, player2.name);
  };

  return { startGame, handleMove, restart };
})();

// Display Controller Module
const DisplayController = (() => {
  const boardEl = document.getElementById("board");
  const messageEl = document.getElementById("message");

  const renderBoard = () => {
    boardEl.innerHTML = "";
    Gameboard.getBoard().forEach((cell, index) => {
      const cellEl = document.createElement("div");
      cellEl.classList.add("cell");
      cellEl.textContent = cell;
      cellEl.addEventListener("click", () => GameController.handleMove(index));
      boardEl.appendChild(cellEl);
    });
  };

  const setMessage = (msg) => {
    messageEl.textContent = msg;
  };

  return { renderBoard, setMessage };
})();

// DOM Setup
document.getElementById("start-btn").addEventListener("click", () => {
  const name1 = document.getElementById("player1-name").value;
  const name2 = document.getElementById("player2-name").value;
  GameController.startGame(name1, name2);
});

document.getElementById("restart-btn").addEventListener("click", () => {
  GameController.restart();
});
