const authorizationHeader = () => {
    // Get token
    const token = localStorage.getItem('authToken');
    const header = {
        Authorization: `Bearer ${token}`
    }

    return header;
}

export const getAuthorizationToken = () => {
    // Get token
    const token = localStorage.getItem('authToken');
    if(token)
        return `Bearer ${token}`;
    return null;
}
export default authorizationHeader;