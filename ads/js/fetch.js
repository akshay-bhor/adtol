import { baseURL } from "./util";

// Get ref URL
const ref_url = window.location.href;

const fetchAd = (token) => {
    return fetch(`${baseURL}/api/display/serve/${token}?ref=${ref_url}`, {
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