
// ROLL BUTTON FUNCTIONALITY
// - Rolls all dice that don't have the .setAside class.
// - Calls checkForPoints after rolling to highlight points, combos, and runs.
// - Disables the "Roll Dice" and "End Turn" buttons temporarily until dice are interacted with or set aside.

// CHECKFORPOINTS FUNCTION
// - Highlights dice with .isPoints, .inCombo, or .inRun based on rolled values.
// - Logs the point breakdown in the console (points, combos, runs).
// - If no points/combinations are found:
//   - Log "NO MOVES!" and skip to the next player (or call gameOver() if applicable).

// GAMEOVER FUNCTION
// - Disables all interactive buttons and announces the results.
// - Displays final scores for all players in a visible scoreboard UI.
// - Handles ties by checking if multiple players have the highest score:
//     - If a tie occurs, declare "TIE!" or determine tiebreakers (e.g., another roll-off).
// - Logs the final scores and winner(s) in the console.

// LASTROUND FUNCTION
// - Triggered if any player’s total score exceeds 10,000 points at the end of their turn.
// - Logs "LAST ROUND STARTED!" in the console and sets a flag (e.g., `isLastRound = true`).
// - Allows every other player one final turn, ending with the player who triggered the last round.
// - At the end of the final turn:
//     - Call gameOver() to determine the winner or handle ties.

// PLAYER INTERACTION WITH DICE
// - Allow clicking on highlighted dice (e.g., those with .isPoints).
// - Clicking a die adds the .setAside class and updates its appearance.
// - Dice with .setAside are excluded from rolling in the next roll.
// - Enable roll and end turn buttons once at least one die is set aside.

// END TURN BUTTON FUNCTIONALITY
// - Adds the total points of .setAside dice to the player's score.
// - Clears all .setAside and .isPoints classes for the next player.
// - Checks if the player meets the winning condition (10,000 points or more):
//     - If the player exceeds 10,000 points for the first time, call lastRound().
// - Moves to the next player if no last round is triggered.

// ADDITIONAL NOTES:
// - Double-check helper functions (e.g., countDice) for performance and accuracy.
// - Use modular helper functions to keep core game logic clean and maintainable.
// - Implement proper error handling for unexpected situations (e.g., empty rolledArray, skipped player).
// - Manage UI updates dynamically:
//     - Show current player, their score, and remaining dice in the HUD.
//     - Use visual cues to distinguish dice states (e.g., .isPoints, .setAside, etc.).
