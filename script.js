// Character array
const allCharacters = ['tanjiro', 'nezuko', 'zenitsu', 'inosuke', 'giyu', 'shinobu', 'kanao', 'rengoku', 'muzan', 'akaza', 'rui', 'tamayo'];

// DOM Elements
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const gameBoard = document.getElementById('gameBoard');
const timerElement = document.getElementById('timer');
const gameOverModal = document.getElementById('gameOverModal');
const winnerModal = document.getElementById('winnerModal');
const closeGameOverModal = document.querySelector('#gameOverModal .close');
const closeWinnerModal = document.querySelector('#winnerModal .close');
const restartGameOverButton = document.getElementById('restartGameOver');
const restartWinnerButton = document.getElementById('restartWinner');
const closeGameOverButton = document.getElementById('closeGameOver');
const closeWinnerButton = document.getElementById('closeWinner');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const backToMenuButton = document.getElementById('backToMenu');

// Game variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer;
let timeRemaining;
let characters;
let currentDifficulty;

// Difficulty settings
const difficulties = {
    facil: { pairs: 6, time: 90, rows: 3, cols: 4 },
    medio: { pairs: 8, time: 60, rows: 4, cols: 4 },
    dificil: { pairs: 12, time: 45, rows: 4, cols: 6 }
};

// Function to start the game
function startGame(difficulty) {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    currentDifficulty = difficulty;
    const { pairs, time, rows, cols } = difficulties[difficulty];
    characters = allCharacters.slice(0, pairs);
    timeRemaining = time;

    createBoard(rows, cols);
}

// Function to create the game board
function createBoard(rows, cols) {
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;

    const cardPairs = [...characters, ...characters];
    shuffleArray(cardPairs);

    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    cardPairs.forEach((character, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.character = character;
        card.addEventListener('click', flipCard);

        const img = document.createElement('img');
        img.src = `images/${character}.jpg`;
        img.alt = character;

        card.appendChild(img);
        gameBoard.appendChild(card);
        cards.push(card);
    });

    startTimer();
}

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to start the timer
function startTimer() {
    timerElement.textContent = `Tiempo restante: ${timeRemaining}s`;
    timer = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = `Tiempo restante: ${timeRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            showModal(gameOverModal);
        }
    }, 1000);
}

// Function to flip a card
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkForMatch, 500);
        }
    }
}

// Function to check for a match
function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.character === card2.dataset.character;

    if (isMatch) {
        matchedPairs++;
        if (matchedPairs === characters.length) {
            clearInterval(timer);
            setTimeout(() => showModal(winnerModal), 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
    }

    flippedCards = [];
}

// Function to show modal
function showModal(modal) {
    modal.style.display = 'block';
}

// Function to hide modal
function hideModal(modal) {
    modal.style.display = 'none';
}

// Function to return to menu
function backToMenu() {
    clearInterval(timer);
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

// Event listeners
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => startGame(button.dataset.difficulty));
});

backToMenuButton.addEventListener('click', backToMenu);

closeGameOverModal.onclick = () => hideModal(gameOverModal);
closeWinnerModal.onclick = () => hideModal(winnerModal);
restartGameOverButton.onclick = restartWinnerButton.onclick = () => startGame(currentDifficulty);