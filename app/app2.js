const players = Array.from({ length: 8 }, () => ({ points: 0, isWinner: false }));
let currentPlayerIndex = 0; // Track the index of the current player
let rolledArray = [];

const dice = document.getElementsByClassName('dice');
const diceAll = Array.from(dice);
const rollBtn = document.getElementById('rollBtn');
const endTurnBtn = document.getElementById('endTurnBtn');


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
    const contributingDice = []; // To track dice contributing to the score
    const diceClasses = Array(diceAll.length).fill(null); // Array to track classes for each die

    // Check for specific combinations
    const hasStraight = counts.every(count => count === 1);
    const hasThreePairs = counts.filter(count => count === 2).length === 3;

    if (hasStraight) {
        points += pointCombinations.straight;
        contributingDice.push(...rolledArray); // All dice contribute to a straight
        diceClasses.fill('straight'); // Assign 'straight' to all dice
    } else if (hasThreePairs) {
        points += pointCombinations.threePairs;
        contributingDice.push(...rolledArray); // All dice contribute to three pairs
        rolledArray.forEach((value, i) => {
            if (counts[value - 1] === 2) {
                diceClasses[i] = 'pair';
            }
        });
    } else {
        // Check for three-of-a-kinds, four-of-a-kinds, and single 1's or 5's
        counts.forEach((count, index) => {
            if (count >= 3) {
                const kindClass = count === 3 ? 'threeOfKind' : count === 4 ? 'fourOfKind' : 'fiveOfKind';
                points += pointCombinations.threeOfAKind[index + 1] * (count / 3);
                for (let i = 0; i < count; i++) {
                    contributingDice.push(index + 1);
                }
                rolledArray.forEach((value, i) => {
                    if (value === index + 1) diceClasses[i] = kindClass;
                });
                count -= 3;
            }
            if ((index + 1 === 1 || index + 1 === 5) && count > 0) {
                points += count * pointCombinations[index + 1];
                for (let i = 0; i < count; i++) {
                    contributingDice.push(index + 1);
                }
                rolledArray.forEach((value, i) => {
                    if (value === index + 1 && diceClasses[i] === null) {
                        diceClasses[i] = 'points';
                    }
                });
            }
        });
    }

    // Update dice classes
    diceAll.forEach((die, i) => {
        die.className = 'dice'; // Reset all classes except the base class
        if (diceClasses[i]) {
            die.classList.add(diceClasses[i]);
        }
    });

    return points;
}



function rollDice() {

    // Clear previous highlights
diceAll.forEach(die => die.classList.remove('highlight'));


    rollBtn.classList.add('disabled');
    rolledArray.length = 0;

    // Roll each die and update the rolledArray
    diceAll.forEach(die => {
        const randomValue = Math.floor(Math.random() * 6) + 1;
        die.textContent = randomValue;
        die.classList.add('clicked');
        rolledArray.push(randomValue); // Add the rolled value to the array
    });

    const points = checkForPoints(rolledArray);
    console.log(`Player ${currentPlayerIndex + 1} rolled: ${rolledArray}`);
        
    // Add the points to the current player's total
    players[currentPlayerIndex].points += points;


    // Check if the current player has won
    if (players[currentPlayerIndex].points >= 10000) {
        players[currentPlayerIndex].isWinner = true;
        console.log(`Player ${currentPlayerIndex + 1} wins!`);
        // Add any additional win logic here (e.g., highlight the winner)
    }
    
    // Move to the next player (cycle back to player 1 after player 8)
}

rollBtn.addEventListener('click', rollDice);

endTurnBtn.addEventListener('click', () => {
    // Update the current player’s total score
    console.log(`Player ${currentPlayerIndex + 1} total score: ${players[currentPlayerIndex].points}`);
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    console.log(`NEW PLAYER: ${currentPlayerIndex + 1}`);
    console.log(`Player ${currentPlayerIndex + 1} total score: ${players[currentPlayerIndex].points}`);

});



