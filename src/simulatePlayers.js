var Firebase = require('firebase'),
    http = require('http'),
    request = require('request'),
    fs = require('fs');
/*
node simulatePlayers.js action=clearChallengeResponses data=data.json firebaseID=singpath-play token=<secret>
node simulatePlayers.js action=simulate numPlayerss=4 data=data.json firebaseID=singpath-play token=<secret>
node simulatePlayers.js action=simulate playerType=player1 numPlayers=4 data=data.json firebaseID=singpath-play token=<secret>
*/

var options={};
var data = null;
var ref;

var setup = function(args){
  var args = args.slice(2);
  for(var i=0; i<args.length; i++){
      var temp = args[i].split("=")
      options[temp[0]] = temp[1]
  }
  //console.log(options);
}

var authenticateWithFirebase = function(callback){
    //TODO: look for passed in token to update firebaseUrl. 
    
    var firebaseUrl = "singpath-play.firebaseio.com";
    var firebaseToken = options['token']; 

    ref = new Firebase(firebaseUrl);
    ref.authWithCustomToken(firebaseToken, function(error, authData) {

    if (error) {
        console.log("Login Failed!", error);
    } else {
        console.log("Firebase login with token succeeded!");
        //console.log("Login Succeeded!", authData);  
    }
    });  
}

var load_data = function(obj){
  data = obj; 
}
var readSimulationData = function(){
    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync(options['data'], 'utf8'));
    load_data(obj);
}

var startSimulation = function(){
    // clearEventProgress for all challenges to reset event. 
    // remove all users from the event. 

    // create numPlayers new players. 
    for (var i=0; i<options["numPlayers"]; i++){
      var finished = function(id){console.log(id,"finished");};
      accessToken = "CREATE_ACCESS_TOKENS";
      createNewPlayer(i, "player1", accessToken, finished);
    }
}

var createNewPlayer = function(id, playerType, accessToken, callback){
    console.log(id+" of type "+playerType+" starting.");
    console.log(id+" logging in.");
    // login player. 
    console.log(id+" registering on ClassMentors");
    // register if player does not exist.
    // lookup details for playerType 
    var instructions = data[playerType];
    if(instructions){
      console.log(id+" loaded instructions for "+playerType);
    } else {
      console.log("ERROR: no instructions found for "+playerType);
    } 
    // Watch event for changes. 
    console.log(id+" watching event "+data.eventKey+" for challenges to open.");
    // Find challenges on event to watch for. 
    for (challengeKey in data[playerType].challenges){
      console.log(id+" waiting for challenge "+challengeKey+" to open");
      //console.log(data[playerType].challenges[challengeKey]);
    }
    
    // When finished, pass id to callback. 
    if(callback) {callback(id);}
}

// Do not run the server when loading as a module. 
if (require.main === module) {
  console.log("Running setup.");
  setup(process.argv);
  authenticateWithFirebase();
  readSimulationData();
  startSimulation();

  var timeout = 5000;
  setTimeout(function () {
    console.log("Exiting after ",timeout,"milliseconds")
        process.exit(0);
  }, timeout);
  

  // Export modules if we aren't running the worker so that we can test functions. 
} else {

  module.exports = {
    "setup":setup,
    "authenticateWithFirebase":authenticateWithFirebase,
    "options":options,
    "load_data":load_data,
    "createNewPlayer":createNewPlayer,
    "ref":ref
  }
}


