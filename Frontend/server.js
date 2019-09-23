var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/lycanthrope');

var Role = require('./model/role');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/role', function(req, res){
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

app.get('/roles', function(req, res) {
    Role.find({}, function(err, roles) {
        if (err) {
            res.status(500).send({error: "Could not find the role information!"})
        } else {
            res.send(roles)
        }
    });
});

// Return the user information
app.put('/role/find', function(req, res) {
    Role.findOne({"userID": req.body.userID}, function(err, roleNeed) {
        if (err) {
            res.status(500).send({error: "Could not find the role information!"})
        } else {
            res.send(roleNeed);
        }
    });
});

// Change the user status, werewolf's ability
app.put('/role/action', function(req, res) {
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

app.listen(3000, function(){
    console.log("狼人已经偷偷潜入了村庄......")
});