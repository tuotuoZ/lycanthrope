import 'whatwg-fetch';

class HttpService {
    getRoles = () => {

        var promise = new Promise((resolve, reject) => {
            fetch('http://10.0.0.46:3004/roles')
            .then(response => {
                resolve(response.json());
            })
        });
        console.log(promise);
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
}

export default HttpService;
