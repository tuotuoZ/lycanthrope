var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/lycanthrope');

var Role = require('./model/role');
var Player = require('./model/player');

var cors = require('cors');


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
    newPlayer.userID = req.body.userID;
    newPlayer.userRole = req.body.userRole;
    newPlayer.userSide = req.body.userSide;
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
  console.log(req.body.userID);
    Player.findOne({"userID": req.body.userID}, function(err, roleNeed) {
        if (err) {
            res.status(500).send({error: "Could not find the role information!"});
        } else {
            console.log(roleNeed);
            res.send(roleNeed);
        }
    });
});

// Kill one player(user), werewolf's and witch's ability
app.post('/player/kill', function(req, res) {
  console.log(req.body);
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
app.listen(3004, function(){
    console.log("狼人已经偷偷潜入了村庄......")
});
