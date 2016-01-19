//
//  TheSaladBot
//  @author: TheSaladMan
//
//  README:
//    *
//    TheSaladBot will not run without first running the preRun Script
//          Included.
//    *
//    Without buying an account with BustStat this bot will not run
//          Simultaneous IP's with the same account will be banned
//          from BustStat with no refunds and no exceptions.
//    *
//    Logging into BustStat you will be able to view the IP addresses
//          contacting your account, and have the option to block those
//          Ip Addresses
//    *
//    This bot does not make bets unless very specific conditions
//          are met. It will not bet for the first 5 rounds by
//          default. It will also not bet unless you have an account
//          with BustStat indicating that you bought the bot. Scripts
//          running from seperate ip's will be banned with no refunds
//     *
//     startnum: The starting bet to place, this grows exponentially
//          so start if off VERY VERY LOW. Too High a number
//          will blow up an account.
//          # I set startnum to be less then or equal
//            to 1/1000 of my account balance.
//     *
//     defaultAdder: If the bot loses the first running round this is
//          the guarenteed minimum profit of the following
//          rounds. Like the startnum set this very very low.
//          # I set defaultAdder = startnum
//      *
//      q1cutoff: This is a statistical value, do not set it higher
//          then 2, Anything lower then 1.29 will increase risk
//          substantially, I never put it lower then 1.29
//      *
//      logDataVars: This logs the bot's running variables in your
//          browsers javascript console
//      *
//      logBetVars: This logs the bot's betting variables in your
//          browsers js console


//
// Cumulative running profit
// Print IP, Username
// Calculate survivable rounds at current stats
// Calculate Cumulative running profit ( bits );
// Calculate Cumulative running profit ( USD );

// Bot Settings
// ====================
var bustStatUserName = "your bustStat username";
var bustStatPassword = "your bustStat password";
var startnum = 2;
var defaultAdder = 2;
var adder = 0;
var minCutoff = 1.28;
var maxCutoff = 10;
var logDataVars = true;
var lossWindow = 2;
// ====================


// Bot Variables - DO NOT CHANGEEEEEEEEEE
// ============================================
// Statistical data DO NOT CHANG!!!
var startRound = 5;
var wonLast;
var winStreak = new Array(); // Win Streak newest first
var sum = 0;  // Total Sum
var mean;     // Mean
var median;   // Median
var mode;     // Mode
var min;      // Min`
var max;      // Max
var sampVar;  // Sample Variance
var ssd;      // Sample Standard Deviation
var std;
var q1Z;
var q1;       // Quartile 1
var q2;       // Quartile 2
var q3;       // Quartile 3
var iqr;      // Inter Quartile Range
var dat = []; // Game Data
var sortData = []; // Sorted Game Data
var post = "\n____________________________________________________"
// Runner Variables
var currentBet;
var last;
var n = 0;
var priorBets = new Array();
var cashout;
var makeBet = false; // Dont Fucking Change this
var period = 5;
var gamesLost = 0;
var wins = 0;
var lossStreak = 0;
var pauseBet = false;
var unpause = false;
// ===========================================

//  Game Crash
engine.on('game_crash', function(data) {
  initials( data );                         // Initial Calculations
  mean = (sum/n);                           // Calculate Mean
  median = calculateMedian( sortData, n );  // Calculate Median
  mode = getPopularElement( sortData );     // Calculate Mode
  sampVar = sampleVariance( dat, n, mean ); // Calculate SampVar
  ssd = Math.sqrt(sampVar);                 // Calculate Variance
  calculateQuartiles( sortData, n, median); // Calculate Distrobution
  calculateBetAndOut(); // Calculate the bet ammount
  logData();                                // Log Bot Data
});


// Array sort function
numberSort = function (a,b) {
    return a - b;
};

// Calculate the initials variables value list
function initials( data ) {

  wonLast = engine.lastGamePlay();
  currentGameID = data.game_id;
  last = ( data.game_crash / 100 );
  sum += last;
  dat.push( last );
  sortData = dat.sort(numberSort);
  n += 1;

  // Record outcome streak
  if ( wonLast === "LOST") {
    // Last game a loss
    winStreak.unshift("L");
    wins = 0;
    lossStreak += 1;
  } else if ( wonLast === "WON" ) {
    // Last game a win
    if ( pauseBet ) {
      unpause = true;
    }
    pauseBet = false;
    currentBet = 0;
    priorBets = new Array();
    winStreak.unshift("W");
    lossStreak = 0;
    wins += 1;
  }

  // Loss Window
  if ( lossStreak > lossWindow ) {
    pauseBet = true;
  }

  // set min/max
  if ( last > max || n === 1 ) { max = last; }
  if ( last < min || n === 1 ) { min = last; }
}



// Game Starting
engine.on('game_starting', function(info) {
    if ( currentBet > 0 && makeBet && !pauseBet ) {
      priorBets.push( currentBet );
      engine.placeBet(
        Math.round( currentBet * 100 ), // Bet
        Math.round( cashout * 100), // Cashout %
        makeBet // Make Bet
      );
      console.log( "Bet Placed");
    }
});

// Calculate the bet ammount
function calculateBetAndOut() {
  cashout = q1;

  if ( cashout < last ) {
    pauseBet = false;
    unpause = true;
  }

  gamesLost = priorBets.length;
  // Determine the bet ammount
  if ( cashout ) {
    if ( cashout < maxCutoff && n >= 5 ) {
      if ( (cashout > minCutoff || gamesLost > 0) && !pauseBet ) {
        if ( priorBets.length >= 1 ) {
          if ( unpause ) {
            unpause = false;
          } else {
            if ( priorBets.length >= 2 ) {
              adder = 0;
            }
            var loss = 0;
            for( var i = 0; i < priorBets.length; i++ ) {
              loss += priorBets[i];
            }
            currentBet = ( loss + adder ) / (cashout - 1);
            currentBet = Math.round( currentBet + 1 );
          }
        } else {
          currentBet = startnum;
          adder = defaultAdder;
        }
        makeBet = true;
      } else {
        makeBet = false;
      }
    } else {
      makeBet = false;
      currentBet = 0;
    }
  }
}


// Gets the running mode element
function getPopularElement( arr ) {
  var uniqs = {};
  for ( var i = 0; i < arr.length; i++ ) {
    uniqs[arr[i]] = (uniqs[arr[i]] || 0) + 1;
  }
  var max = { val: arr[0], count: 1 };
  for( var u in uniqs ) {
      if(max.count < uniqs[u]) { max = { val: u, count: uniqs[u] }; }
  }
  return max.val;
}



// Calculate the running quartiles
function calculateQuartiles( sortData, n, median) {
  if ( n >= 3 ) {
    var temp = Math.round(n/4);
    q2 = median;
    q1 = sortData[ temp ];
    q1Z = (q1 - median ) / ssd
    if ( q1Z < 1 ) {
      q1Z = q1Z * -1;
    }
    q3 = sortData[ n - temp - 1 ]; // - 1 because it is an index
    iqr = q3-q1;
  }
}

// Calculate the running median
function calculateMedian( sortData, n ) {
  var midIndex1 = n/2;
  var returnMed;
  if ( n/2 % 2 === 1 ) {
    returnMed = sortData[ midIndex1 ];
  } else {
    midIndex1 = Math.round( midIndex1 );
    if ( midIndex1 > n/2 ) {
      midIndex2 = midIndex1 - 1;
    } else {
      midIndex2 = midIndex1 + 1;
    }
    returnMed = (sortData[midIndex1] + sortData[midIndex2]) / 2;
  }
  return returnMed;
}

// Log the data
function logData() {

  var betStr = "";
  betStr = betStr.concat(
    "\n\nNext Round: " +
    "\n\t\tPause: " + pauseBet +
    "\n\t\tMaking Bet: " + makeBet +
    "\n\t\tBet: " + currentBet +
    "\n\t\tcashOut: " + cashout
  );

  if ( logDataVars ) {
    console.log(
      "\nRound: " + n +
      "\n\tMin: " + min +
      "\tMax: " + max +

      "\nmean: " + mean +
      "\tMedian: " + median +
      "\tMode: " + mode +

      "\nSum: " + sum +
      "\tLast: " + last +

      "\n" + sortData +

      "\nσ^2: " + sampVar +
      "\tσ: " + ssd +
      "\tq1Z: " + q1Z +

      "\nQ1: " + q1 +
      "\tQ2: " + q2 +
      "\tQ3: " + q3 +
      "\tiqr " + iqr +

      "\nWinStreak: " + winStreak +
      "\npriorBets: " + priorBets +
      "\n\nLast Round: " + wonLast +
      betStr + post
    );
  }
}
