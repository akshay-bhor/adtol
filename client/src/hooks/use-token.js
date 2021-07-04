import { useState } from "react";

const useToken = (tokenName) => {
    const getToken = () => {
        const token = localStorage.getItem(tokenName);

        return token || null;
    }

    const [token, setToken] = useState(getToken(tokenName));

    const saveToken = (token) => {
        localStorage.setItem(tokenName, JSON.stringify(token));
        setToken(token);
    }

    const removeToken = () => {
        localStorage.removeItem(tokenName);
        setToken(null);
    }

    return {
        token,
        saveToken,
        getToken,
        removeToken
    }
}

export default useToken;