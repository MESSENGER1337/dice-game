const dice = document.getElementsByClassName('dice');
const diceAll = Array.from(dice);

const rollBtn = document.getElementById('rollBtn');

function rollDice() {
    diceAll.forEach(die => {
        const randomValue = Math.floor(Math.random() * 6) + 1;
        die.textContent = randomValue;
        die.classList.add('clicked');
    });
}

rollBtn.addEventListener('click', rollDice);
