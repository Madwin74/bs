var busts = new Array();
var round = 0;
var goose = 15;
var avgGoose;

var loses = 0;

var gooseRound = new Array();
var avgGooseSpacing = new Array();

var gooseVariance;
var gooseStandardDev;

var gooseMin;
var gooseMax;@x
var sinceLastGoose;
var betting = false;
var sortGooseMedian;
var sortGooseQ3;

var betAmmount = 1;
var accountBalance;
var survivables;
var gooseSTD;
var run = true;
var ninetyPercent;

engine.on('game_starting', function(data) {
  if ( betting && run ) {
    engine.placeBet( betAmmount * 100, goose * 100, betting);
  } else if ( betting && !run ) {

  }
});



engine.on('game_crash', function(data) {

  round += 1;
  lastGamePlay = engine.lastGamePlay();

  if( lastGamePlay == "WON" ) {
    betting = false;
    betAmmount = 1;
    loses = 0;
  } else if ( lastGamePlay == "Lost" ) {
    loses += 1;
    lost += betAmmount;
    if ( betAmmount * goose < lost ) {
        betAmmount = ((lost * 1.1) / goose);
    }
  }

  busts.unshift( data.game_crash / 100 );
  accountBalance = engine.getBalance()/100;
  survivables = (accountBalance / betAmmount);
  avgGooseSpacing = new Array()

  if ( busts[0] >= goose ) {
    gooseRound.push( round );
  }

  var temp = 0;
  for ( var i = 0; i < gooseRound.length-1; i++ ) {
    avgGooseSpacing.push( gooseRound[i+1] - gooseRound[i] );
    if ( i == 0 ) {
      gooseMin = avgGooseSpacing[0];
      gooseMax = avgGooseSpacing[0];
    }
    if ( avgGooseSpacing[i] < gooseMin ) {
      gooseMin = avgGooseSpacing[i];
    }
    if ( avgGooseSpacing[i] > gooseMax ) {
      gooseMax = avgGooseSpacing[i];
    }
    temp += avgGooseSpacing[i];
  }

  if ( avgGooseSpacing.length > 5 ) {
    sortGooseMedian = avgGooseSpacing[ gooseRound.length-1 / 2];
    sortGooseQ3 = avgGooseSpacing[ Math.round(gooseRound.length - (avgGooseSpacing.length/4)) ];
    avgGoose = temp/avgGooseSpacing.length;
    gooseVariance = variance( avgGooseSpacing, avgGoose );
    gooseStandardDev = Math.sqrt( gooseVariance );
  }

  ninetyPercent = ( 2.4 * gooseStandardDev ) + avgGoose;
  sinceLastGoose = round - gooseRound[gooseRound.length - 1];


  if ( sinceLastGoose >= sortGooseQ3 && gooseRound.length >= 5 && (gooseMax - sinceLastGoose) < goose ) {
      betting = true;
  }

  printVars();

});


function printVars() {
  console.log(
    "\nRound: " + round +
    "\nGoose: " + goose +
    "\nsinceLastGoose: " + sinceLastGoose +
    "\navgGoose: " + avgGoose +
    "\ngooseMin: " + gooseMin +
    "\ngooseMax: " + gooseMax +
    "\ngooseVariance: " + gooseVariance +
    "\ngooseStandardDev: " + gooseStandardDev +
    "\nNinety % Quartile " + ninetyPercent +
    "\n\nBetting: " + betting +
    "\nBet Ammount: " + betAmmount +
    "\nSurvivable rounds: " + survivables +
    "\nAccount Balance: " + accountBalance +
    "\nLast Game Play: " + lastGamePlay +
    "\n" +
    "\ngooseRounds: " + gooseRound +
    "\navgGooseSpacing: " + avgGooseSpacing +
    "\nsortGooseQ3: " + sortGooseQ3 +
    "\n" +
    "\nBusts: " + busts
  );
}

// Array sort function
numberSort = function (a,b) {
    return a - b;
};


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
