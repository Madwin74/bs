
var last;
var average;
var max;
var min;
var mode;
var median;
var startingBalance = engine.getBalance();
var currentBet = 1;
var dat = [];
var sortData = [];

// Runner Variables
var sampleSize = 0;
var sum = 0;
var period = 10;
var cashOut = 1.1;

// Enable variables
var makeBet = false;
var canuse = false;



//
// First Script to run
//
// Anonymous "self-invoking" function
(function() {
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);
    // Poll for jQuery to come into existance
    var checkReady = function(callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function() { checkReady(callback); }, 100);
        }
    };
    // Start polling...
    checkReady(function($) {
        canUse = true;
    });
})();








//
engine.on('game_starting', function(info) {
    currentGameID = info.game_id;
    if ( sampleSize >= period ) {
      engine.placeBet( currentBet * 100, Math.round( cashOut * 100), makeBet);
    }
});


//  Game Crash
engine.on('game_crash', function(data) {
 last = (data.game_crash / 100 )
 if ( sampleSize === 1 ) {
   max = last;
   min = last;
 }
 sampleSize += 1;
 if ( last > max ) {
   max = last;
 }
 if ( last < min ) {
   min = last;
 }
 sum += last
 average = (sum/sampleSize);
 dat.push( last );
 sortData.push( last );
 sortData.sort();
 if ( sortData.length % 2 == 1 ) {
   median = sortData[ (sortData.length-1 / 2) ];
 } else {
   median = sortData[ (sortData.length / 2) ];
 }
 mode = getPopularElement( sortData );
 console.log( "Average: " + average +
              "\nSum: " + sum +
              "\nSampleSize: " + sampleSize +
              "\nMedian: " + median +
              "\nMode: " + mode +
              "\nMax: " + max +
              "\nMin: " + min +
              "\nLast: " + last +
              "\n" + sortData );

    if ( canUse ) {
      console.log( "Can Use JQuery" );
    }
});

//
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













// curl -X POST -H "X-Parse-Application-Id: MlL6RoFPiZ02XXNTrkaLv7QjyGMc1vmLJDPtC88b" -H "X-Parse-REST-API-Key: C2UQc3x5TBynuIxQQWyeCbI48wOcwxCdmdYnHFn4" -H "Content-Type: application/json" -d '{"Bust":1337}' https://api.parse.com/1/classes/Play


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
