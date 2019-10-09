import 'whatwg-fetch';

class HttpService {
    getRoles = () => {

        var promise = new Promise((resolve, reject) => {
            fetch('http://localhost:3004/roles')
            .then(response => {
                resolve(response.json());
            })
        });

        return promise;

    }
}

export default HttpService;
