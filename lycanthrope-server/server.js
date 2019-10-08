var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/lycanthrope');

var Role = require('./model/role');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//Return all roles information for debugging
app.get('/roles', function(req, res) {
    Role.find({}, function(err, roles) {
        if (err) {
            res.status(500).send({error: "Could not find the role information!"})
        } else {
            res.send(roles)
        }
    });
});


//When user picked a role, send the userID and role to the database
app.put('/role', function(req, res){
    var newRole = new Role();
    newRole.userID = req.body.userID;
    newRole.userRole = req.body.userRole;
    newRole.userSide = req.body.userSide;
    newRole.save(function(err, savedRole){
        if (err) {
            res.status(500).send({err:"Could not add the role!"});
        }else {
            res.status(200).send(savedRole);
        }
    });
});



// Return the user information for ability users,right now it's only for seer
app.post('/role/find', function(req, res) {
    Role.findOne({"userID": req.body.userID}, function(err, roleNeed) {
        if (err) {
            res.status(500).send({error: "Could not find the role information!"})
        } else {
            res.send(roleNeed.userSide);
        }
    });
});

// Kill one player(user), werewolf's and witch's ability
app.post('/role/kill', function(req, res) {
    Role.update({"userID": req.body.userID}, {"userStatus": "dead"}, function(err) {
        if (err) {
            res.status(500).send({error:"Cound not update the user status!"});
        } else {
            Role.findOne({"userID": req.body.userID}, function(err, roleToReturn) {
                if (err) {
                    res.status(500).send({error:"Could not find the user information"});
                } else {
                    res.send(roleToReturn);
                }
            });
        }

    });
});

// Revive one player(user), if the player is killed by werewolf.
app.post('/role/revive', function(req, res) {
    Role.update({"userID": req.body.userID}, {"userStatus": "live"}, function(err) {
        if (err) {
            res.status(500).send({error:"Cound not update the user status!"});
        } else {
            Role.findOne({"userID": req.body.userID}, function(err, roleToReturn) {
                if (err) {
                    res.status(500).send({error:"Could not find the user information"});
                } else {
                    res.send(roleToReturn);
                }
            });
        }

    });
});

// Guard one player(user) for tonight
app.post('/role/guard', function(req, res) {
    Role.update({"userID": req.body.userID}, {"userGuard": true}, function(err) {
        if (err) {
            res.status(500).send({error:"Cound not update the user status!"});
        } else {
            Role.findOne({"userID": req.body.userID}, function(err, roleToReturn) {
                if (err) {
                    res.status(500).send({error:"Could not find the user information"});
                } else {
                    res.send(roleToReturn);
                }
            });
        }

    });
});

// Last player to act will unguard the player who has been guarded
app.post('/role/unguard', function(req, res) {
    Role.update({"userID": req.body.userID}, {"userGuard": false}, function(err) {
        if (err) {
            res.status(500).send({error:"Cound not update the user status!"});
        } else {
            Role.findOne({"userID": req.body.userID}, function(err, roleToReturn) {
                if (err) {
                    res.status(500).send({error:"Could not find the user information"});
                } else {
                    res.send(roleToReturn);
                }
            });
        }

    });
});
//Port 3000 is reserved for react frontend
app.listen(3004, function(){
    console.log("狼人已经偷偷潜入了村庄......")
});
