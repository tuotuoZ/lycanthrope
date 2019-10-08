import 'whatwg-fetch';

class HttpService {
    getRoles = () => {
        var promise = new Promise((resolve, reject) => {
            fetch('http://localhost:3004/roles')
            .then(response => {
                console.log(response.json());
            })
        });


    }
}

export default HttpService;
