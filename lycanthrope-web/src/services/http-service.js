import 'whatwg-fetch';

class HttpService {
    getRoles = () => {

        var promise = new Promise((resolve, reject) => {
            fetch('http://10.0.0.46:3004/roles')
            .then(response => {
                resolve(response.json());
            })
        });

        return promise;

    }

    findPlayerSide = (targetID) => {
      var findBody = JSON.stringify({ "userID" : targetID});
      console.log(findBody);
      var promise = new Promise((resolve, reject) => {
          fetch('http://10.0.0.46:3004/player/find',{
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'post',
            body: findBody
          })
          .then(response => {

              resolve(response.json());
          })
      });

      return promise;

    }

    findPlayer = (UUID) => {
      var findBody = JSON.stringify({ "userUniqueID" : UUID});
      console.log(findBody);
      var promise = new Promise((resolve, reject) => {
          fetch('http://10.0.0.46:3004/player/find',{
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'post',
            body: findBody
          })
          .then(response => {

              resolve(response.json());
          })
      });

      return promise;

    }

    guardOnePlayer = (targetID) => {
      var guardBody = JSON.stringify({ "userID" : targetID});
      var promise = new Promise((resolve, reject) => {
          fetch('http://10.0.0.46:3004/player/guard',{
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'post',
            body: guardBody
          })
          .then(response => {

              resolve(response.json());
          })
      });

      return promise;

    }

    killOnePlayer = (targetID) => {
      var killBody = JSON.stringify({ "userID" : targetID});
      var promise = new Promise((resolve, reject) => {
          fetch('http://10.0.0.46:3004/player/kill',{
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'post',
            body: killBody
          })
          .then(response => {

              resolve(response.json());
          })
      });

      return promise;

    }

    reviveOnePlayer = (targetID) => {
      var reviveBody = JSON.stringify({ "userID" : targetID});
      var promise = new Promise((resolve, reject) => {
          fetch('http://10.0.0.46:3004/player/revive',{
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'post',
            body: reviveBody
          })
          .then(response => {

              resolve(response.json());
          })
      });

      return promise;

    }

    createPlayer = (playerID, roleModel) => {
      console.log(roleModel);
      var playerProfile = JSON.stringify({
                                      "userUniqueID":roleModel.UUID,
                                      "userID" : playerID,
                                      "userRole" : roleModel.userRole,
                                      "userSide" : roleModel.userSide});
      console.log(playerProfile);
      var promise = new Promise((resolve, reject) => {
          fetch('http://10.0.0.46:3004/addPlayer',{
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'put',
            body: playerProfile
          })
          .then(response => {

              resolve(response.json());
          })
      });

      return promise;

    }

}

export default HttpService;
