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
    const counts = [0, 0, 0, 0, 0, 0]; // Array for dice values 1 to 6
    rolledArray.forEach(value => {
        counts[value - 1]++; // Increment the count for the corresponding dice value
    });
    return counts;
}

function getDieName(value) {
    const diceNames = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX"];
    return diceNames[value - 1];
}


function checkForPoints(rolledArray) {
    const counts = countDice(rolledArray);
    let points = 0;
    const contributingDice = [];
    const diceClasses = Array(diceAll.length).fill(null); // Array to track classes for each die
    const usedDice = Array(diceAll.length).fill(false); // Track which dice are part of combinations

    console.log("You Rolled:");

    // Check for specific combinations
    const hasStraight = counts.every(count => count === 1);
    if (hasStraight) {
        points += pointCombinations.straight;
        contributingDice.push(...rolledArray);
        diceClasses.fill('straight');
        usedDice.fill(true); // Mark all dice as used
        console.log(`STRAIGHT - 3000pts`);
    }

    const hasThreePairs = counts.filter(count => count === 2).length === 3;
    if (hasThreePairs) {
        points += pointCombinations.threePairs;
        contributingDice.push(...rolledArray);
        rolledArray.forEach((value, i) => {
            if (counts[value - 1] === 2 && !usedDice[i]) {
                diceClasses[i] = 'pair';
                usedDice[i] = true; // Mark pairs as used
            }
        });
        console.log(`THREE PAIRS - 1500pts`);
    }

    // Check for three-of-a-kinds, four-of-a-kinds, and five-of-a-kinds
    counts.forEach((count, index) => {
        const dieValue = index + 1; // Convert index to dice value (1-based)
    
        // Process 3-of-a-kind or higher first
        if (count >= 3) {
            const kindClass = count === 3 ? 'threeOfKind' : count === 4 ? 'fourOfKind' : 'fiveOfKind';
            const pointsForKind = pointCombinations.threeOfAKind[dieValue] * Math.floor(count / 3); // Only count sets of three
            points += pointsForKind;
    
            // Mark contributing dice and apply classes
            let remainingCount = count; // Remaining dice to mark
            rolledArray.forEach((value, i) => {
                if (value === dieValue && !usedDice[i] && remainingCount > 0) {
                    usedDice[i] = true;
                    diceClasses[i] = kindClass;
                    remainingCount--;
                }
            });
    
            console.log(`${getDieName(dieValue)} - ${count}-OF-A-KIND - ${pointsForKind}pts`);
        }
    
        // Process individual `1`s or `5`s not used in a set
        if ((dieValue === 1 || dieValue === 5) && count > 0) {
            let singleCount = 0;
            rolledArray.forEach((value, i) => {
                if (value === dieValue && !usedDice[i]) {
                    singleCount++;
                    usedDice[i] = true; // Mark as used
                    diceClasses[i] = dieValue === 1 ? 'pointsOne' : 'pointsFive';
                }
            });

            if (singleCount > 0) {
                const pointsForSingles = singleCount * pointCombinations[dieValue];
                points += pointsForSingles;
                console.log(`${getDieName(dieValue)} - x${singleCount} - ${pointsForSingles}pts`);
            }
        }
    });

    // Update dice classes
    diceAll.forEach((die, i) => {
        die.className = 'dice'; // Reset all classes except the base class
        if (diceClasses[i]) {
            die.classList.add(diceClasses[i]);
        }
    });

    console.log(`TOTAL POINTS: ${points}`);
    return points;
}








function rollDice() {
    // Clear previous highlights and setAside classes
    diceAll.forEach(die => {
        die.classList.remove('highlight', 'setAside');
    });

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

    // Add the points to the current player's total
    players[currentPlayerIndex].points += points;

    // Check if the current player has won
    if (players[currentPlayerIndex].points >= 10000) {
        players[currentPlayerIndex].isWinner = true;
        console.log(`Player ${currentPlayerIndex + 1} wins!`);
    }
}

rollBtn.addEventListener('click', rollDice);

function handleDiceClick(event) {
    const die = event.target;  // Get the clicked die element
    const dieValue = parseInt(die.textContent); // Get the value of the die (1-6)

    // Get the counts of each die value in the rolled array (for complex sets like 3-of-a-kind)
    const counts = countDice(rolledArray);

    // Handle point dice (1 and 5) where toggling is allowed
    if (dieValue === 1 || dieValue === 5) {
        die.classList.toggle('setAside');
        return;
    }

    // Check if the clicked die is part of a set (3-of-a-kind, 4-of-a-kind, etc.)
    const isInSet = counts[dieValue - 1] >= 3;  // Is this die part of a set? (3 or more dice with the same value)

    if (isInSet) {
        // Get all dice with the same value
        const diceInSet = diceAll.filter(d => parseInt(d.textContent) === dieValue);

        // Check if all dice in the set are already set aside
        const allSetAside = diceInSet.every(d => d.classList.contains('setAside'));

        if (allSetAside) {
            // If all are set aside, remove the `.setAside` class from all dice in the set
            diceInSet.forEach(d => d.classList.remove('setAside'));
        } else {
            // Otherwise, add the `.setAside` class to all dice in the set
            diceInSet.forEach(d => d.classList.add('setAside'));
        }
    }

    // Check for THREE PAIRS combination
    const pairs = counts.filter(count => count === 2).length;
    if (pairs === 3) {
        // For each pair (two dice with the same value), toggle the .setAside class
        counts.forEach((count, index) => {
            if (count === 2) {
                const diceInPair = diceAll.filter(d => parseInt(d.textContent) === index + 1);
                diceInPair.forEach(d => d.classList.toggle('setAside'));
            }
        });
    }

    // Check for STRAIGHT combination (all dice values are unique)
    if (counts.every(count => count === 1)) {
        // If all dice are unique, toggle .setAside class on all dice involved in the straight
        diceAll.forEach(die => die.classList.toggle('setAside'));
    }
}



// Add the event listener to each die element
diceAll.forEach(die => {
    die.addEventListener('click', handleDiceClick);
});





endTurnBtn.addEventListener('click', () => {
    // Update the current player’s total score
    console.log(`Player ${currentPlayerIndex + 1} total score: ${players[currentPlayerIndex].points}`);
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    console.log(`NEW PLAYER: ${currentPlayerIndex + 1}`);
    console.log(`Player ${currentPlayerIndex + 1} total score: ${players[currentPlayerIndex].points}`);

});



