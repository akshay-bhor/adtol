import { useRouter } from "next/router";
import { useEffect } from "react";
import { validAuthToken } from "./common";

const NotAuth = WrappedComponent => props => {
    const router = useRouter();

    useEffect(() => {
        if(validAuthToken() !== false) router.replace('/dashboard');
    }, []);

    // Check localstorage token
    if(validAuthToken() === false || !process.browser) {
        return <WrappedComponent {...props} />
    }
    else {
        return null;
    }
} 

export default NotAuth;