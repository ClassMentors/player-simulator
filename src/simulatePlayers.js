var Firebase = require('firebase'),
    http = require('http'),
    request = require('request'),
    fs = require('fs');
/*
node simulatePlayers.js action=clearChallengeResponses data=data.json numPlayers=2 firebaseID=singpath-play token=<secret>
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

var clearAllChallengeSubmissionsForEvent = function(eventKey){
    console.log("Clearing submissions for event "+eventKey);
    //TODO
}

var removeAllParticipantsFromEvent = function(eventKey){
    console.log("Removing all participants from event "+eventKey);
    //TODO
}

var createPlayerAccessToken = function(playerId,accesstoken){
  console.log("creating token for player "+playerId);
  var FirebaseTokenGenerator = require("firebase-token-generator");
  var tokenGenerator = new FirebaseTokenGenerator(accesstoken);
  // By default, create tokens that expire in June 2017
  var playerToken = tokenGenerator.createToken({ uid: playerId, some: "arbitrary", data: "here" },
                                         { expires:1497151174 });
  //console.log(playerToken);
  return playerToken;
}

var startSimulation = function(){
    // clearEventProgress for all challenges to reset event. 
    var eventKey = data['eventKey'];
    clearAllChallengeSubmissionsForEvent(eventKey);
    // remove all users from the event. 
    removeAllParticipantsFromEvent(eventKey);
    // create numPlayers new players. 
    for (var i=0; i<options["numPlayers"]; i++){
      var finished = function(id){console.log(id,"finished");};
      var uid = "Player_"+i;
      playerToken = createPlayerAccessToken(uid,options['token']);
      createNewPlayer(uid, "player1", playerToken, finished);
    }
}

var registerPlayerOnClassMentors = function(playerId){
    console.log(playerId+" registering on ClassMentors.");
    //TODO
}

var registePlayerForEvent = function(playerId, eventId, password){
    console.log(playerId+" joining event "+eventId);
    //TODO
}


var createNewPlayer = function(id, playerType, playerToken, callback){
    console.log(id+" of type "+playerType+" starting.");

    // Register player on ClassMentors
    registerPlayerOnClassMentors(id);

    // Have player join event. 
    registePlayerForEvent(id, data.eventKey, data.eventPassword);
    // lookup details for playerType 
    var instructions = data.players[playerType];
    if(instructions){
      //console.log(id+" loaded instructions for "+playerType);
    } else {
      console.log("ERROR: no instructions found for "+playerType);
    } 
    // Watch event for changes. 
    console.log(id+" watching event "+data.eventKey+" for challenges to open.");
    // Watch for challenges to open and submit response provided in data.json file. 
    for (challengeRef in data.players[playerType].challenges){
      // TODO - add code to check for open challenges and then watch for challenges to open.
      // TODO - submit responses to challenges once they open. 
      //console.log(id+" waiting for challenge "+challengeRef+" ("+data.challenges[challengeRef]+").");
      console.log(id+" submitting response for challenge "+challengeRef+" ("+data.challenges[challengeRef]+") to open");
      
    }
    
    // Once submissions have been make for all the challenges, pass id to callback. 
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


