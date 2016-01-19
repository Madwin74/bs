
// Game variables
var round = 0;
var gCrashes = new Array();        // Array of game crashes newest first
var gSortedCrashes = new Array();  // Sorted array of global crashes

var sCrashes;
var sSortedCrashes;


var gSum, sSum;

// sampleSize
var sampleSize = 10;

// 5 stat
var gMean, sMean;
var gMedian, sMedian;
var gMode, sMode;
var gMin, sMin;
var gMax, sMax;

// Quartiles
var gQ1, sQ1;
var gQ2, sQ2;
var gQ3, sQ3;
var gIQR, sIQR;

// Global Variance and standard deviation
var gVariance, sVariance;
var gStandardDeviation, sStandardDeviation;

var q1Z;
//




// On Game Crash
//
//
engine.on('game_crash', function(data) {

  // Increment the round
  round += 1;
  // Add the last crash
  gCrashes.unshift( data.game_crash / 100 );
  gSortedCrashes = gCrashes.sort( numberSort );
  // Calculate the statistical data
  calculateGlobals( data );   // Calculate the global data
  calculateSamples( data );   // Calculate the sampleSize data
});





function calculateGlobals( data ) {
  gSum += gCrashes[0];
  gMean = gSum/round
  gMedian = gSortedCrashes[ Math.round( round/2)];
  gMode = getPopularElement( gSortedCrashes );

  // Do only once the first time
  doFirstOnce();

  // Min/Max
  if ( gCrashes[0] > gMax ) {
    gMax = gCrashes[0];
  }
  if ( gCrashes[0] < gMin ) {
    gMin = gCrashes[0];
  }

  // Quartiles
  calculateGlobalQuartiles( gSortedCrashes, round, gMedian );

  // Calculate the sample variance
  gVariance = globalVariance( gCrashes, round, gMedian );
  gStandardDeviation = Math.sqrt( gVariance );
}



//
//  Calculate the sample data statistics
//
//
function calculateSamples( data ) {

  initSamples();

  for ( var i = 0; i < sCrashes.size; i++ ) {
    sSum += sCrashes[i];
  }

  sMean = sSum / sampleSize;
  sMedian = sSortedCrashes[ Math.round( sampleSize/2 )];
  sMode = getPopularElement( sSortedCrashes );

  sMin = sSortedCrashes[0];
  sMax = sSortedCrashes[sampleSize - 1]

  calculateSampleQuartiles( sSortedCrashes );


}

// Init sample variables
function initSamples() {
  sCrashes = new Array(); // new sample crashes array
  sSortedCrashes = new Array(); // new sample sorted crashes aray
  // If the global data collection is not yet
  if ( gCrashes.length < sampleSize ) {
    sampleSize = gCrashes.length;
  }
  // Generate the crashes of size sampleSize
  for ( var i = 0; i < sampleSize; i++ ) {
    sCrashes.unshift( gCrashes[i] );
  }
  // Generate the sorted array of sampleSize crashes
  sSortedCrashes = sCrashes.sort( numberSort );
}









function doFirstOnce() {
  if ( round == 1 ) {
    gMin = gCrashes[0];
    gMax = gCrashes[0];
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

// 
// Calculate the global quartiles
function calculateGlobalQuartiles() {
  var temp = Math.round(n/4);
  gQ2 = gMedian;
  gQ1 = gSortedCrashes[ temp ];
  q3 = gSortedCrashes[ round - temp - 1 ]; // - 1 because it is an index
  gIQR = gQ3-gQ1;
}

// Calculate the sample quartiles
function calculateSampleQuartiles() {
  var temp = Math.rond( sampleSize/4 );
  sQ1 = sSortedCrashes[ temp ];
  sQ2 = sMedian;
  sQ3 = sSortedCrashes[ sampleSize - temp - 1];
  sIQR = sQ3 - sQ1;
}

// Calculates the running sample variance
function globalVariance( ) {
  var multiplex = 1/(round-1);
  var tempSum = 0;
  var temp = 0;
  for ( var i = 0; i < round; i++ ) {
    temp = Math.pow( gCrashes[i] - gMean, 2 );
    if ( temp < 0 ) {
      temp = temp*-1;
    }
    tempSum += temp;
  }
  return multiplex * tempSum;
}
