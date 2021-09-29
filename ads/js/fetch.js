import { baseURL } from "./util";

const fetchAd = (token) => {
    return fetch(`${baseURL}/api/display/serve/${token}`, {
        method: 'GET'
    })
    .then(res => { 
        return res.json();
    })
    .catch(err => {
        throw new Error('Error Fetching Ad!');
    })
}

export default fetchAd;