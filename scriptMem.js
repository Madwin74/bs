// Adds jquery to the script resources
( function() {
    var script, chartDiv;
    script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);
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



// call
// Post to the parse api
//postToParse( last, engine.getEngine().gameId );
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
