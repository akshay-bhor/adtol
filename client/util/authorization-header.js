const authorizationHeader = () => {
    // Get token
    if(typeof window !== 'undefined' && window.localStorage) {
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
    if(typeof window !== 'undefined' && window.localStorage) {
        token = window.localStorage.getItem('authToken');
    }

    if(token) return `Bearer ${token}`;
    return null;
}
export default authorizationHeader;