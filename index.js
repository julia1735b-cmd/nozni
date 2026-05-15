window.onload = function() {
    
    const screens = {
        menu: document.getElementById('menuScreen'),
        computer: document.getElementById('computerScreen'),
        human: document.getElementById('humanScreen')
    };
    
    function showScreen(screenName) {
        for (let key in screens) {
            screens[key].classList.remove('active');
        }
        screens[screenName].classList.add('active');
    }
    
    document.getElementById('playWithComputer').addEventListener('click', function() {
        showScreen('computer');
    });
    
    document.getElementById('playWithHuman').addEventListener('click', function() {
        showScreen('human');
    });
    
    document.getElementById('backFromComputer').addEventListener('click', function() {
        showScreen('menu');
    });
    
    document.getElementById('backFromHuman').addEventListener('click', function() {
        showScreen('menu');
    });
    
    setupComputerGame();
    setupHumanGame();
    
};

function setupComputerGame() {
    let compPlayerScore = 0;
    let compComputerScore = 0;
    let compGameOver = false;
    const WIN_SCORE = 5;
    
    const choices = ['rock', 'scissors', 'paper'];
    const emojis = { rock: '✊', scissors: '✌', paper: '✋' };
    const names = { rock: 'Камень', scissors: 'Ножницы', paper: 'Бумага' };
    
    const playerScoreEl = document.getElementById('playerScoreComputer');
    const computerScoreEl = document.getElementById('computerScore');
    const turnIndicator = document.getElementById('turnIndicatorComputer');
    const statusMessage = document.getElementById('statusMessageComputer');
    const playerChoiceDisplay = document.getElementById('playerChoiceDisplayComputer');
    const computerChoiceDisplay = document.getElementById('computerChoiceDisplayComputer');
    const choiceButtons = document.querySelectorAll('#computerScreen .choice-btn');
    const resetButton = document.getElementById('resetButtonComputer');
    
    function getComputerChoice() {
        return choices[Math.floor(Math.random() * 3)];
    }
    
    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) return 'draw';
        if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'scissors' && computerChoice === 'paper') ||
            (playerChoice === 'paper' && computerChoice === 'rock')
        ) {
            return 'player';
        }
        return 'computer';
    }
    
    function updateDisplay(playerChoice, computerChoice, result) {
        playerChoiceDisplay.textContent = emojis[playerChoice];
        computerChoiceDisplay.textContent = emojis[computerChoice];
        playerChoiceDisplay.classList.remove('winner-glow');
        computerChoiceDisplay.classList.remove('winner-glow');
        
        if (result === 'player') {
            statusMessage.textContent = names[playerChoice] + ' бьёт ' + names[computerChoice] + '. Вы выиграли раунд!';
            playerChoiceDisplay.classList.add('winner-glow');
        } else if (result === 'computer') {
            statusMessage.textContent = names[computerChoice] + ' бьёт ' + names[playerChoice] + '. Компьютер выиграл раунд!';
            computerChoiceDisplay.classList.add('winner-glow');
        } else {
            statusMessage.textContent = 'Оба выбрали ' + names[playerChoice] + '. Ничья!';
        }
    }
    
    function checkGameEnd() {
        if (compPlayerScore >= WIN_SCORE) {
            compGameOver = true;
            turnIndicator.textContent = '🏆 Вы победили!';
        } else if (compComputerScore >= WIN_SCORE) {
            compGameOver = true;
            turnIndicator.textContent = '😞 Компьютер победил';
        }
    }
    
    function disableButtons(disabled) {
        choiceButtons.forEach(function(btn) {
            btn.disabled = disabled;
            btn.style.opacity = disabled ? '0.5' : '1';
            btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
        });
    }
    
    function makeMove(playerChoice) {
        if (compGameOver) return;
        
        const computerChoice = getComputerChoice();
        const result = determineWinner(playerChoice, computerChoice);
        
        if (result === 'player') compPlayerScore++;
        else if (result === 'computer') compComputerScore++;
        
        playerScoreEl.textContent = compPlayerScore;
        computerScoreEl.textContent = compComputerScore;
        updateDisplay(playerChoice, computerChoice, result);
        checkGameEnd();
    }
    
    function resetGame() {
        compPlayerScore = 0;
        compComputerScore = 0;
        compGameOver = false;
        playerScoreEl.textContent = '0';
        computerScoreEl.textContent = '0';
        playerChoiceDisplay.textContent = '❓';
        computerChoiceDisplay.textContent = '❓';
        turnIndicator.textContent = 'Сделайте выбор';
        statusMessage.textContent = 'Выберите камень, ножницы или бумагу';
        playerChoiceDisplay.classList.remove('winner-glow');
        computerChoiceDisplay.classList.remove('winner-glow');
        disableButtons(false);
    }
    
    choiceButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            makeMove(this.getAttribute('data-choice'));
        });
    });
    
    resetButton.addEventListener('click', resetGame);
}

function setupHumanGame() {
    let humPlayer1Score = 0;
    let humPlayer2Score = 0;
    let humGameOver = false;
    const WIN_SCORE = 5;
    
    let humPlayer1Choice = null;
    let humPlayer2Choice = null;
    let humCurrentPlayer = 1;
    
    const emojis = { rock: '✊', scissors: '✌', paper: '✋' };
    const names = { rock: 'Камень', scissors: 'Ножницы', paper: 'Бумага' };
    
    const player1ScoreEl = document.getElementById('player1Score');
    const player2ScoreEl = document.getElementById('player2Score');
    const turnIndicator = document.getElementById('turnIndicatorHuman');
    const player1Hint = document.getElementById('player1Hint');
    const player2Hint = document.getElementById('player2Hint');
    const player1Buttons = document.querySelectorAll('.player1-btn');
    const player2Buttons = document.querySelectorAll('.player2-btn');
    const resetButton = document.getElementById('resetButtonHuman');
    
    function togglePlayerButtons() {
        if (humGameOver) {
            player1Buttons.forEach(b => b.classList.add('disabled'));
            player2Buttons.forEach(b => b.classList.add('disabled'));
            return;
        }
        
        if (humCurrentPlayer === 1) {
            player1Buttons.forEach(b => b.classList.remove('disabled'));
            player2Buttons.forEach(b => b.classList.add('disabled'));
            player1Hint.textContent = 'Ваш ход, выбирайте';
            player2Hint.textContent = 'Ждите свой ход';
        } else {
            player1Buttons.forEach(b => b.classList.add('disabled'));
            player2Buttons.forEach(b => b.classList.remove('disabled'));
            player1Hint.textContent = 'Ждите свой ход';
            player2Hint.textContent = 'Ваш ход, выбирайте';
        }
    }
    
    function determineWinner(choice1, choice2) {
        if (choice1 === choice2) return 'draw';
        if (
            (choice1 === 'rock' && choice2 === 'scissors') ||
            (choice1 === 'scissors' && choice2 === 'paper') ||
            (choice1 === 'paper' && choice2 === 'rock')
        ) {
            return 'player1';
        }
        return 'player2';
    }
    
    function resolveRound() {
        const result = determineWinner(humPlayer1Choice, humPlayer2Choice);
        
        if (result === 'player1') {
            humPlayer1Score++;
            turnIndicator.textContent = names[humPlayer1Choice] + ' бьёт ' + names[humPlayer2Choice] + '. Игрок 1 выиграл!';
        } else if (result === 'player2') {
            humPlayer2Score++;
            turnIndicator.textContent = names[humPlayer2Choice] + ' бьёт ' + names[humPlayer1Choice] + '. Игрок 2 выиграл!';
        } else {
            turnIndicator.textContent = 'Оба выбрали ' + names[humPlayer1Choice] + '. Ничья!';
        }
        
        player1ScoreEl.textContent = humPlayer1Score;
        player2ScoreEl.textContent = humPlayer2Score;
        
        if (humPlayer1Score >= WIN_SCORE) {
            humGameOver = true;
            turnIndicator.textContent = '🏆 Игрок 1 победил!';
        } else if (humPlayer2Score >= WIN_SCORE) {
            humGameOver = true;
            turnIndicator.textContent = '🏆 Игрок 2 победил!';
        }
        
        humPlayer1Choice = null;
        humPlayer2Choice = null;
        humCurrentPlayer = 1;
        
        if (!humGameOver) {
            turnIndicator.textContent = 'Игрок 1 делает выбор';
        }
        
        togglePlayerButtons();
    }
    
    player1Buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (humGameOver || humCurrentPlayer !== 1) return;
            humPlayer1Choice = this.getAttribute('data-choice');
            humCurrentPlayer = 2;
            turnIndicator.textContent = 'Игрок 2 делает выбор';
            togglePlayerButtons();
        });
    });
    
    player2Buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (humGameOver || humCurrentPlayer !== 2) return;
            humPlayer2Choice = this.getAttribute('data-choice');
            resolveRound();
        });
    });
    
    function resetGame() {
        humPlayer1Score = 0;
        humPlayer2Score = 0;
        humGameOver = false;
        humPlayer1Choice = null;
        humPlayer2Choice = null;
        humCurrentPlayer = 1;
        
        player1ScoreEl.textContent = '0';
        player2ScoreEl.textContent = '0';
        turnIndicator.textContent = 'Игрок 1 делает выбор';
        player1Hint.textContent = 'Ваш ход, выбирайте';
        player2Hint.textContent = 'Ждите свой ход';
        togglePlayerButtons();
    }
    
    resetButton.addEventListener('click', resetGame);
}
