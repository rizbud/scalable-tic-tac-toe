const boardWidth = 500;
const boardSize = document.getElementById("board-size");
const startButton = document.getElementById("start-btn");
const gameStatus = document.getElementById("status");

let size = 0;
let currentPlayer = "X";
let cells = [];
let cellSize = 0;

function startGame() {
  size = parseInt(boardSize.value);

  if (isNaN(size) || size < 3) {
    alert("Please enter a valid board size (minimum 3)");
    return;
  }

  cells = Array(size * size).fill("");
  renderBoard();

  boardSize.disabled = true;
  boardSize.value = size;
  startButton.disabled = true;
  gameStatus.textContent = `Player ${currentPlayer}'s turn`;
}

function renderBoard() {
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.maxWidth = `${boardWidth}px`;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");

    cell.classList.add("cell");

    // set the width, height and font size of the cell based on the board width and size
    cell.style.width = `${boardWidth / size}px`;
    cell.style.height = `${boardWidth / size}px`;
    cell.style.fontSize = `${boardWidth / size}px`;

    cell.addEventListener("click", () => handleMove(i));

    // add the class if the cell has a value
    cells[i] && cell.classList.add(cells[i]);

    fragment.appendChild(cell);
  }

  board.appendChild(fragment);
}

function handleMove(index) {
  if (cells[index] || checkWin()) return;

  const cell = document.querySelector(`.cell:nth-child(${index + 1})`);

  cells[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);

  if (checkWin()) {
    gameStatus.textContent = `Player ${currentPlayer} wins!`; // Display win message
    boardSize.disabled = false;
    startButton.disabled = false;

    const winningPattern = getWinningPattern().find((pattern) =>
      pattern.every((index) => cells[index] === currentPlayer)
    );

    winningPattern?.forEach((index) => {
      const cell = document.querySelector(`.cell:nth-child(${index + 1})`);
      cell.classList.add("winning-cell");
    });

    return;
  }

  if (cells.every((cell) => cell)) {
    gameStatus.textContent = "It's a draw!";
    boardSize.disabled = false;
    startButton.disabled = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  gameStatus.textContent = `Player ${currentPlayer}'s turn`;
}

function getWinningPattern() {
  // Define winning patterns based on board size
  let patterns = [];

  // Rows
  for (let i = 0; i < size; i++) {
    patterns.push(Array.from({ length: size }, (_, j) => i * size + j));
  }

  // Columns
  for (let i = 0; i < size; i++) {
    patterns.push(Array.from({ length: size }, (_, j) => i + j * size));
  }

  // Diagonals
  patterns.push(Array.from({ length: size }, (_, i) => i * (size + 1))); // Main diagonal
  patterns.push(
    Array.from({ length: size }, (_, i) => (i + 1) * (size - 1)).slice(0, size)
  ); // Anti-diagonal

  return patterns;
}

function checkWin() {
  const patterns = getWinningPattern();

  return patterns.some((pattern) =>
    pattern.every((index) => cells[index] === currentPlayer)
  );
}
