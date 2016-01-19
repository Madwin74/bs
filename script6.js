
// Game variables
var round = 0;
var crashes = new Array();
var sortedCrashes = new Array();
var sum = 0;

// sampleSize
var sample

// Global 5 stat
var gmean;
var gmedian;
var gmode;
var gmin;
var gmax;

// Sample 5 stat
var smean;
var smedian;
var smode;
var smin;
var smax;


// Quartiles
var gq1;
var gq2;
var gq3;
var giqr;

// Global Variance and standard deviation
var gVariance;
var gStandardDeviation;

// Sample Varance and standard deviation
var sVariance;
var sStandardDeviation;

var q1Z;
//




// On Game Crash
//
//
engine.on('game_crash', function(data) {

  // Increment the round
  round += 1;

  // Add the last crash
  crashes.push( data.game_crash / 100 );
  sortedCrashes = crashes.sort( numberSort );

  calculateGlobals( data );
  calculateSamples( data );
});





function calculateGlobals( data ) {
  gsum += crashes[round - 1];
  gmean = sum/round
  gmedian = sortedCrashes[ Math.round( round/2)];
  gmode = getPopularElement( sortedCrashes );

  // Do only once the first time
  doFirstOnce();

  // Min/Max
  if ( crashes[round-1] > max ) {
    gmax = crashes[round-1];
  }
  if ( crashes[round-1] < min ) {
    gmin = crashes[round-1];
  }

  // Quartiles
  calculateGlobalQuartiles( sortedCrashes, round, median );

  // Calculate the sample variance
  gVariance = globalVariance( crashes, round, median );
  gStandardDeviation = Math.sqrt(gVariance);
}


function calculateSamples( data ) {

}












function doFirstOnce() {
  if ( round == 1 ) {
    min = crashes[0];
    max = crashes[0];
  }
}
// Array sort function
numberSort = function (a,b) {
    return a - b;
};
// Gets the running mode element
function getPopularElement( arr ) {
  var uniqs = {};
  for ( var i = 0; i < arr.length; i++ ) {
    uniqs[arr[i]] = ( uniqs[arr[i]] || 0 ) + 1;
  }
  var max = { val: arr[0], count: 1 };
  for ( var u in uniqs ) {
      if(max.count < uniqs[u]) {
        max = { val: u, count: uniqs[u] };
      }
  }
  return max.val;
}
// Calculate the running quartiles
function calculateQuartiles( sortData, n, median) {
  var temp = Math.round(n/4);
  q2 = median;
  q1 = sortedCrashes[ temp ];
  q1Z = (q1 - median ) / ssd;
  if ( q1Z < 1 ) {
    q1Z = q1Z * -1;
  }
  q3 = sortData[ n - temp - 1 ]; // - 1 because it is an index
  iqr = q3-q1;
}
// Calculates the running sample variance
function globalVariance( crashes, n, mean ) {
  var multiplex = 1/(n-1);
  var tempSum = 0;
  var temp = 0;
  for ( var i = 0; i < crashes.length; i++ ) {
    temp = Math.pow( crashes[i] - mean, 2 );
    if ( temp < 0 ) {
      temp = temp*-1;
    }
    tempSum += temp;
  }
  return multiplex * tempSum;
}
