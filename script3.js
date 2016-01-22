
//
// Add the JQuery Lib to the page
// Anonymous "self-invoking" function
( function() {
    //
    // add the jquery lib
    script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);

    //
    // Poll for jQuery to come into existance
    var checkReady = function(callback) {
        if ( window.jQuery ) {
          callback(jQuery);
        } else {
            window.setTimeout( function() {
              checkReady(callback);
            }, 100);
        }
    };
    checkReady( function($) {
    });
})();




//  Game Crash
engine.on('game_crash', function( data ) {
  var last = (data.game_crash / 100 );
  var gameId = engine.getEngine().gameId;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.parse.com/1/classes/Play", true);
  xhr.setRequestHeader("X-Parse-Application-Id", "MlL6RoFPiZ02XXNTrkaLv7QjyGMc1vmLJDPtC88b");
  xhr.setRequestHeader("X-Parse-REST-API-Key", "C2UQc3x5TBynuIxQQWyeCbI48wOcwxCdmdYnHFn4");
  xhr.setRequestHeader("Content-Type", "application/json");
  var msg = JSON.stringify({ bust: last, gId: gameId });
  xhr.send( msg );
});
