// Statistical data
var sum = 0;// Total Sum
var mean;   // Mean
var median; // Median
var mode;   // Mode
var min;    // Min`
var max;    // Max
var PopulationVariance;// Sample Variance
var PopulationStandardDeviation;    // Sample Standard Deviation
var q1;     // Quartile 1
var q2;     // Quartile 2
var q3;     // Quartile 3
var iqr;    // Inter Quartile Range
var dat = [];
var sortData = [];

// Runner Variables
var currentBet;
var last;
var n = 0;
var priorBets = new Array();
var cashout;
var makeBet = true;
var period = 5;
var streak = 0;
var safetyBrake = 4;


//
//  Game Crash
engine.on('game_crash', function(data) {
  // Initial Calculations
  last = ( data.game_crash / 100 )
  sum += last
  dat.push( last );
  sortData = dat.sort();
  n += 1;
  mean = (sum/n);

  // Calculate the median
  median = sortData[Math.pow(round) - 1];

  // Get the Mode
  mode = getPopularElement( sortData );

  // Calculate Global Variance
  gVariance = globalVariance( dat, n, mean );

  // Calculate Global Standard Deviation
  gStandardDeviation = Math.sqrt( gVariance );

  // Calculate quartiles
  if ( n > 3 ) {
    calculateQuartiles( sortData, n, median);
  }
  // set min/max
  if ( last > max || n === 1 ) { max = last; }
  if ( last < min || n === 1 ) { min = last; }
  // Log the values
  console.log( "mean: " + mean + "\nSum: " + sum +
    "\nn: " + n +
    "\nMedian: " + median + "\nMode: " + mode +
    "\nMax: " + max + "\nMin: " + min +
    "\nLast: " + last + "\n" + sortData +
    "\nσ^2: " + sampVar + "\nσ: " + ssd +
    "\nQ1: " + q1 + " Q2: " + q2 + " Q3: " + q3 + " iqr " + iqr );
  // Post to the parse api
  postToParse( last, engine.getEngine().gameId );

  //
  if ( last > cashout && cashout ) {
    priorBets = new Array();
  }

  // Set cashout to be the lower quartile
  cashout = q1;

  //
  if ( cashout ) {
    if ( cashout < 2 ) {
      if ( priorBets.length >= 1 ) {
        var loss = 0;
        for( var i = 0; i < priorBets.length; i++ ) {
          loss += priorBets[i];
        }
        currentBet = loss / (cashout - 1);
        currentBet = Math.round( currentBet + 1 );
        console.log( "New Bet: " + currentBet );
      } else {
        currentBet = 1;
      }
    } else {
      currentBet = 0;
    }
  }
  console.log( "Cashout: " + cashout );
  console.log( priorBets );
});

// Posts the last value to the parse rest api
function postToParse( last, gameId ) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.parse.com/1/classes/Play", true);
  xhr.setRequestHeader("X-Parse-Application-Id", "MlL6RoFPiZ02XXNTrkaLv7QjyGMc1vmLJDPtC88b");
  xhr.setRequestHeader("X-Parse-REST-API-Key", "C2UQc3x5TBynuIxQQWyeCbI48wOcwxCdmdYnHFn4");
  xhr.setRequestHeader("Content-Type", "application/json");
  var data = JSON.stringify({ bust: last, gId: gameId });
  xhr.send(data);
}

// Gets the mode element
function getPopularElement( arr ) {
  var uniqs = {};
  for( var i = 0; i < arr.length; i++ ) {
    uniqs[arr[i]] = (uniqs[arr[i]] || 0) + 1;
  }
  var max = { val: arr[0], count: 1 };
  for( var u in uniqs ) {
      if(max.count < uniqs[u]) { max = { val: u, count: uniqs[u] }; }
  }
  return max.val;
}

// Calculates the sample variance
function globalVariance( dat, n, mean ) {
  var multiplex = 1/(n-1);
  var sum = 0;
  var temp = 0;
  for ( var i = 0; i < dat.length; i++ ) {
    temp = Math.pow( dat[i] - mean, 2 );
    if ( temp < 0 ) {
      temp = temp*-1;
    }
    sum += temp;
  }
  return multiplex * sum;
}

// Calculate the quartiles
function calculateQuartiles( sortData, n, median) {
  q2 = median;
  var temp = Math.round(n/4);
  q1 = sortData[ temp ];
  q3 = sortData[ n - temp - 1 ]; // - 1 because it is an index
  iqr = q3-q1;
}

//
engine.on('game_starting', function(info) {
    currentGameID = info.game_id;
    if ( n > 5 ) {
      console.log( "Current Bet: " + currentBet + " cashOut: " + cashout );
      priorBets.push( currentBet );
      engine.placeBet( Math.round( currentBet * 100 ), Math.round( cashout * 100), makeBet);
    }
});

// --------------------------------------------------------------
// 4506
// 7000





// Cashed out
engine.on('cashed_out', function(data) {
});
// Connected
engine.on('connected', function(data) {
});
// Disconnected
engine.on('disconnected', function(data) {
});
// Joined
engine.on( 'joined', function(data) {
});
// Lag change
engine.on( 'lag_change', function(data) {
});
// what?
engine.on( 'nyan_cat_animation', function( data ) {
});
// player bet
engine.on( 'player_bet', function( data ) {
});
