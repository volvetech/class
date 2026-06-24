const cells = document.querySelectorAll('[data-cell]');
const gameStatus = document.querySelector('.game-status p');
const restartButton = document.getElementById('restartButton');
const winningMessage = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const exitButton = document.getElementById('exitButton');

let isXTurn = true;
let gameActive = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(e) {
    const cell = e.target;
    const currentClass = isXTurn ? 'x' : 'o';

    if (cell.classList.contains('x') || cell.classList.contains('o') || !gameActive) {
        return;
    }

    cell.classList.add(currentClass);

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        switchTurn();
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
    } else {
        winningMessageTextElement.innerText = `${isXTurn ? "X's" : "O's"} Wins!`;
    }
    winningMessage.classList.add('show');
    gameActive = false;
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
}

function switchTurn() {
    isXTurn = !isXTurn;
    gameStatus.innerText = `${isXTurn ? "X's" : "O's"} turn`;
}

function checkWin(currentClass) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function restartGame() {
    cells.forEach(cell => {
        cell.classList.remove('x');
        cell.classList.remove('o');
    });
    isXTurn = true;
    gameActive = true;
    gameStatus.innerText = "X's turn";
    winningMessage.classList.remove('show');
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', restartGame);

exitButton.addEventListener('click', () => {
    winningMessage.classList.remove('show');
});