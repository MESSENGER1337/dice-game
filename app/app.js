const dice = document.getElementsByClassName('dice');
const diceAll = Array.from(dice);

const rollBtn = document.getElementById('rollBtn');

function rollDice() {
    diceAll.forEach(die => {
        const randomValue = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
        die.textContent = randomValue; // Set the dice value
    });
}

rollBtn.addEventListener('click', rollDice);
