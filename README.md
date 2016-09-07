# player-simulator
Simulates players joining ClassMentors events for simulations, loading tests, and performance testing


npm install
npm test

node simulatePlayers.js action=clearChallengeResponses data=data.json numPlayers=2 firebaseID=singpath-play token=<FIREBASE_SECRET>

Running setup.
Clearing submissions for event EVENT1234
Removing all participants from event EVENT1234
creating token
Player_0 of type player1 starting.
Player_0 logging in.
Player_0 registering on ClassMentors
Player_0 loaded instructions for player1
Player_0 watching event EVENT1234 for challenges to open.
Player_0 waiting for challenge 1 (challengeKey1) to open
Player_0 waiting for challenge 2 (challengeKey2) to open
Player_0 finished
creating token
Player_1 of type player1 starting.
Player_1 logging in.
Player_1 registering on ClassMentors
Player_1 loaded instructions for player1
Player_1 watching event EVENT1234 for challenges to open.
Player_1 waiting for challenge 1 (challengeKey1) to open
Player_1 waiting for challenge 2 (challengeKey2) to open
Player_1 finished


