// Statistical data
var sum = 0;// Total Sum
var mean;   // Mean
var median; // Median
var mode;   // Mode
var min;    // Min`
var max;    // Max
var sampVar;// Sample Variance
var ssd;    // Sample Standard Deviation
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
var cashOut;
var makeBet = true;
var period = 5;
var streak = 0;
var safetyBrake = 4;


var basebet = 2;



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
  var midIndex1 = n/2;
  if ( n/2 % 1 === 0 ) {
    median = sortData[ midIndex1 ];
  } else {
    midIndex1 = Math.round( midIndex1 );
    if ( midIndex1 > n/2 ) {
      midIndex2 = midIndex1 - 1;
    } else {
      midIndex2 = midIndex1 + 1;
    }
    var medSum = sortData[midIndex1] + sortData[midIndex2]
    mdedian = medSum/2;
  }
  // Get the Mode
  mode = getPopularElement( sortData );
  // Calculate Sample Variance
  sampVar = sampleVariance( dat, n, mean );
  // Calculate Sample Standard Deviation
  ssd = Math.sqrt(sampVar);
  // Calculate quartiles
  if ( n > 3 ) {
    calculateQuartiles( sortData, n, median);
  }
  // set min/max
  if ( last > max || n === 1 ) { max = last; }
  if ( last < min || n === 1 ) { min = last; }

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
      } else {
        currentBet = basebet;
      }
    } else {
      currentBet = 0;
    }
  }
});


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
function sampleVariance( dat, n, mean ) {
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
