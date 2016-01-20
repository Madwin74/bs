// Bot Variables:
var runningSampleSize = 10;
var betAmmount = 0;
var cashout = 0;
var makeBet = false;
var priorBets;
var wonLastGame;
var lastBust;
var streak = new Array();
var winStreak = 0;
var loseStreak = 0;
var omitStreak = 0;

// styling variables:
var uLine = "\n______________________________________________________________________________";
var title;
var space = "\t\t\t\t";
var strLen = 6;
var gStr = "Glob";
var sStr = "Samp";
var eStr = " = ";
var labelString;
var sumString;
var meanString;
var medianString;
var modeString;
var minString;
var maxString;
var varianceString;
var stdString;
var q1String;
var q2String;
var q3String;
var iqrString;
// Game variables
var round = 0;
// sampleSize
var sampleSize;
var globalHigh = 1;
var globalLow = -1;
var gCrashes = new Array();        // Array of game crashes newest first
var gSortedCrashes = new Array();  // Sorted array of global crashes
var sCrashes;
var sSortedCrashes;
var gSum = 0, sSum = 0;
// 5 stat
var gMean, sMean;     // Mean
var gMeanHigh = eStr;
var lostMeanCount = 0;
var wonMeanCount = 0;
var gMedian, sMedian; // Median
var gMedianHigh = eStr;
var lostMedianCount = 0;
var wonMedianCount = 0;
var gMode, sMode;     // Mode
var gModeHigh = eStr;
var gMin, sMin;       // Min
var gMax, sMax;       // Max
// Quartiles
var q1, gQ1, sQ1;       // Q1
var gQ1High = eStr;
var lostQ1Count = 0;
var wonQ1Count = 0;
var q2, gQ2, sQ2;       // Q2
var gQ2High = eStr;
var lostQ2Count = 0;
var wonQ2Count = 0;
var q3, gQ3, sQ3;       // Q3
var gQ3High = eStr;
var lostQ3Count = 0;
var wonQ3Count = 0;
var iqr, gIQR, sIQR;      // IQR
var gIQRHigh = eStr;
var lostIQRCount = 0;
var wonIQRCount = 0;
var gVariance, sVariance;  // Variance
var gVarianceHigh = eStr;
var lostVarianceCount = 0;
var wonVarianceCount = 0;
var gStandardDeviation, sStandardDeviation; // Standard Deviation
var gStandardDeviationHigh = eStr;
var lostStandardDeviationCount = 0;
var wonStandardDeviationCount = 0;

// On Game Crash
engine.on('game_crash', function(data) {
  // Increment the round
  round += 1;
  getPreviousRound( data );
  setUpRound();
  // Calculate the statistical data
  calculateGlobals( data );   // Calculate the global data
  calculateSamples( data );   // Calculate the sampleSize data
  // Calculate Which is higher of the global/sample variables
  calculateGlobalHighs();
  // Set Bet Data
  setBetData();

  // Print out the crash data
  printCrashData();
});
// On Game Starting
engine.on('game_starting', function(data) {
  if ( makeBet ) {
    priorBets.push( betAmmount );
    engine.placeBet(
      Math.round( betAmmoung * 100 ), // Bet
      Math.round( cashout * 100), // Cashout %
      makeBet // Make Bet
    );
    console.log( "Bet Placed");
  }
});
// Set the bet data
function setBetData() {
  cashout = gQ1;
}
// Analyze the cashout
function analyzeCashout() {
  // Only analyze data aquired after
  // The defaultSampleSize has been exceeded
  if ( round > runningSampleSize ) {
    if ( lastBust < cashout ) {
      // Mean
      if ( gMean > sMean ) {
        lostMeanCount += globalHigh;
      } else if ( gMean < sMean ) {
        lostMeanCount += globalLow;
      }
      // Median
      if ( gMedian > sMedian ) {
        lostMedianCount += globalHigh;
      } else if ( gMedian < sMedian ) {
        lostMedianCount += globalLow;
      }
      // Q1
      if ( gQ1 > sQ1 ) {
        lostQ1Count += globalHigh;
      } else if ( gQ1 < sQ1 ) {
        lostQ1Count += globalLow;
      }
      // Q2
      if ( gQ2 > sQ2 ) {
        lostQ2Count += globalHigh;
      } else if ( gQ2 < sQ2 ) {
        lostQ2Count += globalLow;
      }
      // Q3
      if ( gQ3 > gQ3 ) {
        lostQ3Count += globalHigh;
      } else if ( gQ3 < gQ3 ) {
        lostQ3Count += globalLow;
      }
      // IQR
      if ( gIQR > sIQR ) {
        lostIQRCount += globalHigh;
      } else if ( gIQR < sIQR ) {
        lostIQRCount += globalLow;
      }
      // Variance
      if ( gVariance > sVariance ) {
        lostVarianceCount += globalHigh;
      } else if ( gVariance < sVariance ) {
        lostVarianceCount += globalLow;
      }
      // sStandardDeviation
      if ( gStandardDeviation > sStandardDeviation ) {
        lostStandardDeviationCount += globalHigh;
      } else if ( gStandardDeviation < gStandardDeviation ) {
        lostStandardDeviationCount += globalLow;
      }

    } else if ( lastBust > cashout ) {
      // Mean
      if ( gMean > sMean ) {
        wonMeanCount += globalHigh;
      } else if ( gMean < sMean ) {
        wonMeanCount += globalLow;
      }
      // Median
      if ( gMedian > sMedian ) {
        wonMedianCount += globalHigh;
      } else if ( gMedian < sMedian ) {
        wonMedianCount += globalLow;
      }
      // Q1
      if ( gQ1 > sQ1 ) {
        wonQ1Count += globalHigh;
      } else if ( gQ1 < sQ1 ) {
        wonQ1Count += globalLow;
      }
      // Q2
      if ( gQ2 > sQ2 ) {
        wonQ2Count += globalHigh;
      } else if ( gQ2 < sQ2 ) {
        wonQ2Count += globalLow;
      }
      // Q3
      if ( gQ3 > gQ3 ) {
        wonQ3Count += globalHigh;
      } else if ( gQ3 < gQ3 ) {
        wonQ3Count += globalLow;
      }
      // IQR
      if ( gIQR > sIQR ) {
        wonIQRCount += globalHigh;
      } else if ( gIQR < sIQR ) {
        wonIQRCount += globalLow;
      }
      // Variance
      if ( gVariance > sVariance ) {
        wonVarianceCount += globalHigh;
      } else if ( gVariance < sVariance ) {
        wonVarianceCount += globalLow;
      }
      // sStandardDeviation
      if ( gStandardDeviation > sStandardDeviation ) {
        wonStandardDeviationCount += globalHigh;
      } else if ( gStandardDeviation < gStandardDeviation ) {
        wonStandardDeviationCount += globalLow;
      }
    }
  }
}
// Gets data from the previous round
function getPreviousRound( data ) {
  wonLastGame = engine.lastGamePlay()
  lastBust = ( data.game_crash / 100 );

  analyzeCashout();

  // Add the last crash
  gCrashes.unshift( lastBust );
  gSortedCrashes.unshift( gCrashes[0] );
  gSortedCrashes = gSortedCrashes.sort( numberSort );

  if ( wonLastGame == "WON" ) {
    streak.unshift('W');
    winStreak += 1;
    loseStreak = 0;
    omitStreak = 0;
  } else if ( wonLastGame == "LOST" ) {
    streak.unshift('L');
    loseStreak += 1;
    winStreak = 0;
    omitStreak = 0;
  } else {
    streak.unshift("Om");
    omitStreak += 1;
  }
}
// Set up the next round
function setUpRound() {
  if ( wonLastGame === "WON" ) {
    priorBets = new Array();
  }
}
//
function calculateGlobalHighs() {
  if ( gMean > sMean ) {
    gMeanHigh = gStr;
  } else if ( gMean == sMean ) {
    gMeanHigh = eStr;
  } else {
    gMeanHigh = sStr;
  }
  if ( gMedian > sMedian ) {
    gMedianHigh = gStr;
  } else if ( gMedian == sMedian ) {
    gMedianHigh = eStr;
  } else {
    gMedianHigh = sStr;
  }
  if ( gMode > sMode ) {
    gModeHigh = gStr;
  } else if ( gMode == sMode ) {
    gModeHigh = eStr;
  } else {
    gModeHigh = sStr;
  }
  if ( gQ1 > sQ1 ) {
    gQ1High = gStr;
  } else if ( gQ1 == sQ1 ) {
    gQ1High = eStr;
  } else {
    gQ1High = sStr;
  }
  if ( gQ2 > sQ2 ) {
    gQ2High = gStr;
  } else if ( gQ2 == sQ2 ) {
    gQ2High = eStr;
  } else {
    gQ2High = sStr;
  }
  if ( gQ3 > sQ3 ) {
    gQ3High = gStr;
  } else if ( gQ3 == sQ3 ) {
    gQ3High = eStr
  } else {
    gQ3High = sStr;
  }
  if ( gIQR > sIQR ) {
    gIQRHigh = gStr;
  } else if ( gIQR == sIQR ) {
    gIQRHigh = eStr;
  } else {
    gIQRHigh = sStr;
  }
  if ( gVariance >= sVariance ) {
    gVarianceHigh = gStr;
  } else if ( gVariance == sVariance ) {
    gVarianceHigh = eStr;
  } else {
    gVarianceHigh = sStr;
  }
  if ( gStandardDeviation > sStandardDeviation ) {
    gStandardDeviationHigh = gStr;
  } else if ( gStandardDeviation == sStandardDeviation ) {
    gStandardDeviationHigh = eStr;
  }else {
    gStandardDeviationHigh = sStr;
  }
}
// Print data on crash
function printCrashData() {
  title = "\t\t\t\tTheSaladBot_7:(" + round + ")";
  labelString = "\n\tGlobal(" + round + "):" +
    space.substring(0, space.length-1) +
    "Sample(" + sampleSize + "):" +
    space.substring(0, space.length-1) +
    "G ? S\n";

  // Unused Strings
  sumString = "\n   Sum:\t" + ps(gSum) + space + sSum;
  minString = "\n   min:\t" + ps(gMin) + space + ps(sMin);
  maxString = "\n   max:\t" + ps(gMax) + space + ps(sMax);

  // Used Strings
  meanString = "\n  mean:\t" + ps(gMean) + space + ps(sMean) + space + gMeanHigh;
  medianString = "\nmedian:\t" + ps(gMedian) + space + ps(sMedian) + space + gMedianHigh;
  modeString = "\n  mode:\t" + ps(gMode) + space + ps(sMode) + space + gModeHigh;
  varianceString = "\n   S^2:\t" + ps(gVariance) + space + ps(sVariance) + space + gVarianceHigh;
  stdString = "\n     S:\t" + ps(gStandardDeviation) + space + ps(sStandardDeviation) + space + gStandardDeviationHigh;
  q1String = "\n    Q1:\t" + ps( gQ1 ) + space + ps( sQ1 ) + space + gQ1High;
  q2String = "\n    Q2:\t" + ps( gQ2 ) + space + ps( sQ2 ) + space + gQ2High;
  q3String = "\n    Q3:\t" + ps( gQ3 ) + space + ps( sQ3 ) + space + gQ2High;
  iqrString ="\n   IQR:\t" + ps( gIQR) + space + ps( sIQR ) + space + gIQRHigh;
  console.log(
    title +
    "\n" +
    labelString +
    meanString +
    medianString +
    modeString +
    "\n" +
    varianceString +
    stdString +
    "\n" +
    q1String +
    q2String +
    q3String +
    iqrString +
    "\n" +
    "\nGlobal unsorted:" + gCrashes +
    "\nSample Sorted:" + sSortedCrashes +
    "\n\n" + streak +
    "\n Win Streak: " + winStreak +
    "\n Lose Streak: " + loseStreak +
    "\n Omits: " + omitStreak +
    "\n Cashout: " + cashout +

    "\n\n Wins: " +
    "\n mean: " + wonMeanCount +
    "\n median: " + wonMedianCount +
    "\n Q1: " + wonQ1Count +
    "\n Q2: " + wonQ2Count +
    "\n Q3: " + wonQ3Count +
    "\n IQR: " + wonIQRCount +
    "\n Variance: " + wonVarianceCount +
    "\n sStandardDeviation: " + wonStandardDeviationCount +

    "\n\n Losses: " +
    "\n mean: " + lostMeanCount +
    "\n median: " + lostMedianCount +
    "\n Q1: " + lostQ1Count +
    "\n Q2: " + lostQ2Count +
    "\n Q3: " + lostQ3Count +
    "\n IQR: " + lostIQRCount +
    "\n Variance: " + lostVarianceCount +
    "\n sStandardDeviation: " + lostStandardDeviationCount +

    uLine
  );
}
// A printout format function
function ps( str ) {
  if ( !str ) {
    return "___";
  }
  var retStr = "";
  retStr = retStr.concat(str.toString().substring(0, strLen))
  return retStr;
}
// calculate Globals
function calculateGlobals( data ) {
  // Global 5
  gSum += gCrashes[0];
  gMean = gSum/round;
  gMedian = gSortedCrashes[ Math.round(round/2)-1 ];
  gMode = getPopularElement( gSortedCrashes );
  // Do only once the first time
  if ( round == 1 ) {
    gMin = gCrashes[0];
    gMax = gCrashes[0];
  }
  // Global Min/Max
  if ( gCrashes[0] > gMax ) {
    gMax = gCrashes[0];
  }
  if ( gCrashes[0] < gMin ) {
    gMin = gCrashes[0];
  }
  // Global Quartiles
  calculateQuartiles( gSortedCrashes, gMedian );
  setGlobalQuartiles();
  // Calculate the Global Variance
  gVariance = variance( gCrashes, gMedian );
  gStandardDeviation = Math.sqrt( gVariance );
}
//  Calculate the sample data statistics
function calculateSamples( data ) {
  initSamples();

  for ( var i = 0; i < sCrashes.length; i++ ) {
    sSum += sCrashes[i];
  }
  // Sample 5
  sMean = sSum / sampleSize;
  sMedian = sSortedCrashes[ Math.round(sampleSize/2) - 1];
  sMode = getPopularElement( sSortedCrashes );
  sMin = sSortedCrashes[0];
  sMax = sSortedCrashes[sampleSize - 1]
  // Sample Quartiles
  calculateQuartiles( sSortedCrashes, sMedian );
  setSampleQuartiles();
  // Calculate the Sample Variance
  sVariance = variance( sCrashes, sMedian );
  // Sample Standard Deviation
  sStandardDeviation = Math.sqrt( sVariance );
}
// Init sample variables
function initSamples() {
  // Instantiate Sample Array
  sCrashes = new Array(); // new sample crashes array
  sSortedCrashes = new Array(); // new sample sorted crashes aray
  // If the global data collection is not yet
  if ( gCrashes.length < runningSampleSize ) {
    sampleSize = gCrashes.length;
  } else {
    sampleSize = runningSampleSize;
  }
  // Generate the crashes of size sampleSize
  for ( var i = 0; i < sampleSize; i++ ) {
    sCrashes.push( gCrashes[i] );
    sSortedCrashes.push( gCrashes[i] );
  }
  // Generate the sorted array of sampleSize crashes
  sSortedCrashes = sSortedCrashes.sort( numberSort );
  sSum = 0;
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
// Calculate quartiels of the passed sorted array
function calculateQuartiles( sortedArr, median ) {
  var temp = Math.round( sortedArr.length / 4 );
  q1 = sortedArr[ temp ];
  q2 = median;
  q3 = sortedArr[ sortedArr.length - temp - 1 ]; // - 1 because it is an index
  iqr = q3 - q1;
}
function setSampleQuartiles() {
  sQ1 = q1;
  sQ2 = q2;
  sQ3 = q3;
  sIQR = iqr;
}
function setGlobalQuartiles() {
  gQ1 = q1;
  gQ2 = q2;
  gQ3 = q3;
  gIQR = iqr;
}
// Calculates the variance of the passed array/mean combination
function variance( crashes, mean ) {
  var multiplex = 1/(crashes.length-1);
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
