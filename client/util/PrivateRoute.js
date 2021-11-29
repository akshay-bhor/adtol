import { useRouter } from "next/router";
import { useEffect } from "react";
import { validAuthToken } from "./common";

const PrivateRoute = WrappedComponent => props => {
    if(!process.browser) return null;

    const router = useRouter();

    useEffect(() => {
        if(validAuthToken() === false) router.replace('/register');
        // Remove Google One tap
        if (window.google) window.google.accounts.id.cancel();
    }, []);

    // Check localstorage token
    if(validAuthToken() !== false) {
        return <WrappedComponent {...props} />
    }
    else {
        return null;
    }
} 

export default PrivateRoute;