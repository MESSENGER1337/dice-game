const players = Array(8).fill({ points: 0, isWinner: false });
let currentPlayerIndex = 0; // Track the index of the current player
let rolledArray = [];

const dice = document.getElementsByClassName('dice');
const diceAll = Array.from(dice);
const rollBtn = document.getElementById('rollBtn');

// Define point combinations (example)
const pointCombinations = {
    1: 100,
    5: 50,
    threeOfAKind: {
        1: 1000,
        2: 200,
        3: 300,
        4: 400,
        5: 500,
        6: 600,
    },
    straight: 3000,
    threePairs: 1500,
};

// Helper function to count dice frequencies
function countDice(rolledArray) {
    const counts = [0, 0, 0, 0, 0, 0];
    rolledArray.forEach(value => {
        counts[value - 1]++;
    });
    return counts;
}

// Check for points in a roll
function checkForPoints(rolledArray) {
    const counts = countDice(rolledArray);
    let points = 0;

    // Check for specific combinations
    const hasStraight = counts.every(count => count === 1);
    const hasThreePairs = counts.filter(count => count === 2).length === 3;

    if (hasStraight) {
        points += pointCombinations.straight;
    } else if (hasThreePairs) {
        points += pointCombinations.threePairs;
    } else {
        // Check for three-of-a-kinds and single 1's or 5's
        counts.forEach((count, index) => {
            if (count >= 3) {
                points += pointCombinations.threeOfAKind[index + 1];
                count -= 3; // Remove counted dice
            }
            if (index + 1 === 1 || index + 1 === 5) {
                points += count * pointCombinations[index + 1];
            }
        });
    }

    return points;
}

function rollDice() {
    // Clear the rolledArray for the new roll
    rolledArray.length = 0;

    // Roll each die and update the rolledArray
    diceAll.forEach(die => {
        const randomValue = Math.floor(Math.random() * 6) + 1;
        die.textContent = randomValue;
        die.classList.add('clicked');
        rolledArray.push(randomValue); // Add the rolled value to the array
    });

    // Check for points with the updated rolledArray
    const points = checkForPoints(rolledArray);
    console.log(`You rolled: ${rolledArray}`);
    console.log(`You scored: ${points}`);
    
    // Add the points to the current player's total
    players[currentPlayerIndex].points += points;

    // Update the current player’s total score
    console.log(`Player ${currentPlayerIndex + 1} total score: ${players[currentPlayerIndex].points}`);

    // Check if the current player has won
    if (players[currentPlayerIndex].points >= 10000) {
        players[currentPlayerIndex].isWinner = true;
        console.log(`Player ${currentPlayerIndex + 1} wins!`);
        // Add any additional win logic here (e.g., highlight the winner)
    }
    
    // Move to the next player (cycle back to player 1 after player 8)
    // currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
}

rollBtn.addEventListener('click', rollDice);
