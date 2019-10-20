var express = require("express");
var app = express();
var server = app.listen(3004);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/lycanthrope');
var io = require('socket.io').listen(server);

var Role = require('./model/role');
var Player = require('./model/player');

var cors = require('cors');
var userCount = 0;
var goodPlayerCount = 0;
var badPlayerCount = 0;
var lastNightKill = -1;
var lastNightPoison = -1;
var confirmKill = -1;
var witchRevive = false;
var guardID = -1;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// Use cors package to overcome the access-origin-control problem
app.use(cors());

//Return all roles information for debugging
app.get('/roles', function(req, res) {
    Role.find({}, function(err, roles) {
        if (err) {
            res.status(500).send({error: "Could not find the role information!"});
        } else {
            res.send(roles);
        }
    });
});

// Test out the socket.io
io.on('connection', function(socket){
  var self = this;

  userCount++;
  console.log(`a user connected. A total of ${userCount} user connected.`);
  socket.on('disconnect', function(){
    userCount--;
    console.log(`user disconnected. Now, ${userCount} user remain.`);
  });

  socket.on('witchRevive', function(){
    witchRevive = true;
  });


  socket.on('werewolf', function(toKillID){
    console.log("玩家已击杀，消息已送出。")
    console.log(`to kill id is ${toKillID}, lastNightKill is ${lastNightKill}, boolean is ${(lastNightKill == -1)}`)
    if (lastNightKill == -1)  {
      lastNightKill = toKillID;
      confirmKill = toKillID;
    } else {
      if ( lastNightKill == toKillID) {
        confirmKill = toKillID;
      }else {
        confirmKill = 0
      }
    }
    console.log(`confirmkil is ${confirmKill}`);
    io.emit('werewolf', toKillID);
  });

  socket.on('poison', function(toPoisonID){
    lastNightPoison = toPoisonID;
    console.log("玩家已投毒，消息已送出。")
    io.emit('poison', lastNightPoison);
  });

  socket.on('guard', function(toGuardID){
    guardID = toGuardID;
    console.log(`${toGuardID} 玩家已被守卫。`)
  });

  socket.on('enterDay', function(){


    if ( guardID == confirmKill ){
      var guarded = true;
      if ((guarded && !witchRevive) || (!guarded && witchRevive)) {
        confirmKill = 0;
      }
    } else {
      if (witchRevive) {
        confirmKill = 0;
      }
    }

    io.emit('enterDay', lastNightPoison, confirmKill);
    console.log("enter day sent");

    //Initialize all the variables
    lastNightKill = -1;
    lastNightPoison = -1;
    confirmKill = -1;
    guardID = -1;
    witchRevive = false;

  });
});




app.get('/players', function(req, res) {
    Player.find({}, function(err, roles) {
        if (err) {
            res.status(500).send({error: "Could not find the role information!"});
        } else {
            res.send(roles);
        }
    });
});

//When user picked a role, send the userID and role to the database
app.put('/addPlayer', function(req, res){
    var newPlayer = new Player();
    newPlayer.userUniqueID = req.body.userUniqueID;
    newPlayer.userID = req.body.userID;
    newPlayer.userRole = req.body.userRole;
    newPlayer.userSide = req.body.userSide;
    if (newPlayer.userSide == "good") {
      goodPlayerCount++;
    } else {
      badPlayerCount++;
    }
    newPlayer.save(function(err, savedPlayer){
        if (err) {
            res.status(500).send({err:"Could not add the Player!"});
        }else {
            res.status(200).send(savedPlayer);
        }
    });
});



// Return the user information for ability users,right now it's only for seer
app.post('/player/find', function(req, res) {
    Player.findOne(req.body, function(err, roleNeed) {

        if (err) {
            res.status(500).send({error: "Could not find the role information!"});
        } else {
            res.send(roleNeed);
        }
    });
});

// Kill one player(user), werewolf's and witch's ability
app.post('/player/kill', function(req, res) {
    Player.updateOne({"userID": req.body.userID}, {"userStatus": "dead"}, function(err) {
        if (err) {
            res.status(500).send({error:"Cound not update the user status!"});
        } else {
            Player.findOne({"userID": req.body.userID}, function(err, playerToReturn) {
                if (err) {
                    res.status(500).send({error:"Could not find the user information"});
                } else {
                    res.send(playerToReturn);
                }
            });
        }

    });
});

// Revive one player(user), if the player is killed by werewolf.
app.post('/player/revive', function(req, res) {
  console.log(req.body);
    Player.update({"userID": req.body.userID}, {"userStatus": "live"}, function(err) {
        if (err) {
            res.status(500).send({error:"Cound not update the user status!"});
        } else {
            Player.findOne({"userID": req.body.userID}, function(err, playerToReturn) {
                if (err) {
                    res.status(500).send({error:"Could not find the user information"});
                } else {
                    res.send(playerToReturn);
                }
            });
        }

    });
});

// Guard one player(user) for tonight
app.post('/player/guard', function(req, res) {
    Player.update({"userID": req.body.userID}, {"userGuard": true}, function(err) {
        if (err) {
            res.status(500).send({error:"Cound not update the user status!"});
        } else {
            Player.findOne({"userID": req.body.userID}, function(err, playerToReturn) {
                if (err) {
                    res.status(500).send({error:"Could not find the user information"});
                } else {
                    res.send(playerToReturn);
                }
            });
        }

    });
});

// Last player to act will unguard the player who has been guarded
app.post('/player/unguard', function(req, res) {
    Player.update({"userID": req.body.userID}, {"userGuard": false}, function(err) {
        if (err) {
            res.status(500).send({error:"Cound not update the user status!"});
        } else {
            Player.findOne({"userID": req.body.userID}, function(err, playerToReturn) {
                if (err) {
                    res.status(500).send({error:"Could not find the user information"});
                } else {
                    res.send(playerToReturn);
                }
            });
        }

    });
});
//Port 3000 is reserved for react frontend
// http.listen(3004, function(){
//     console.log("狼人已经偷偷潜入了村庄......")
// });
