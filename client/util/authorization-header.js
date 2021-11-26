const authorizationHeader = () => {
    // Get token
    if(process.browser) {
        const token = window.localStorage.getItem('authToken');
        const header = {
            Authorization: `Bearer ${token}`
        }

        return header;
    }
    return null;
}

export const getAuthorizationToken = () => {
    // Get token
    let token;
    if(process.browser) {
        token = window.localStorage.getItem('authToken');
    }

    if(token) return `Bearer ${token}`;
    return null;
}
export default authorizationHeader;