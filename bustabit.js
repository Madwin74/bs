// Settings
var bet = 10;
var baseBet = 2;
var baseMultiplier = 1.05;
var variableBase = true;
var streakSecurity = 4;
var maximumBet = 999999;

// Variables - Do not touch!
var baseSatoshi = baseBet * 100;
var currentBet = baseSatoshi;
var currentMultiplier = baseMultiplier;
var currentGameID = -1;
var firstGame = true;
var lossStreak = 0;
var coolingDown = false;

// Algorithmic decisions
var sum = 0;


// Initialization
console.log('TateBot')
console.log('My username is: ' + engine.getUsername());
console.log('Starting balance: ' + (engine.getBalance() / 100).toFixed(2) + ' bits');


var startingBalance = engine.getBalance();


// On a game starting, place the bet.
engine.on('game_starting', function(info) {
  currentGameID = info.game_id;
  if ( coolingDown ) {
    if ( lossStreak == 0 ) {
      coolingDown = false;
    } else {
      lossStreak--;
      return;
    }
  }

  // Display data only after first game played.
  if (!firstGame) {
    console.log('[Stats] Session profit: ' + ((engine.getBalance() - startingBalance) / 100).toFixed(2) + ' bits');
    console.log('[Stats] Profit percentage: ' + (((engine.getBalance() / startingBalance) - 1) * 100).toFixed(2) + '%');
  }


  // If last game loss:
  if ( engine.lastGamePlay() == 'LOST' && !firstGame) {
    lossStreak++;
    var totalLosses = 0; // Total satoshi lost.
    var lastLoss = currentBet; // Store our last bet.
    while (lastLoss >= baseSatoshi) { // Until we get down to base bet, add the previous losses.
      totalLosses += lastLoss;
      lastLoss /= 4;
    }
    // If we're on a loss streak, wait a few games!
    if (lossStreak > streakSecurity) {
      coolingDown = true;
      return;
    }
    currentBet *= 4; // Then multiply base bet by 4!
    currentMultiplier = 1 + (totalLosses / currentBet);
  } else { // Otherwise if win or first game:
    lossStreak = 0; // If it was a win, we reset the lossStreak.
    if ( variableBase ) { // If variable bet enabled.
      var divider = 100;
      for (i = 0; i < streakSecurity; i++) {
        divider += (100 * Math.pow(4, (i + 1)));
      }
      newBaseBet = Math.min( Math.max( bet, Math.floor(engine.getBalance() / divider)), maximumBet * 100); // In bits
      newBaseSatoshi = newBaseBet * 100;
      if ((newBaseBet != baseBet) || (newBaseBet == 1)) {
        baseBet = newBaseBet;
        baseSatoshi = newBaseSatoshi;
      }
    }
    currentBet = baseSatoshi;
    currentMultiplier = baseMultiplier;
  }

  firstGame = false;

  if ( currentBet <= engine.getBalance() ) {
    if ( currentBet > ( maximumBet * 100 ) ) {
      currentBet = maximumBet;
    }
    engine.placeBet(currentBet, Math.round( currentMultiplier * 100), false);
  } else {
    if ( engine.getBalance() < 100 ) {
      engine.stop();
    } else {
      baseBet = 1;
      baseSatoshi = 100;
    }
  }
});
