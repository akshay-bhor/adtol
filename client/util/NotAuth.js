import { useRouter } from "next/router";
import { validAuthToken } from "./common";

const NotAuth = WrappedComponent => props => {
    const router = useRouter();

    // Check localstorage token
    if(validAuthToken() === false || !process.browser) {
        return <WrappedComponent {...props} />
    }
    else {
        router.push('/dashboard');

        return (
            null
        );   
    }
} 

export default NotAuth;