import { useRouter } from "next/router";
import { validAuthToken } from "./common";

const PrivateRoute = WrappedComponent => props => {
    if(!process.browser) return null;

    const router = useRouter();

    // Check localstorage token
    if(validAuthToken() !== false) {
        return <WrappedComponent {...props} />
    }
    else {
        router.replace('/register');

        return (
            null
        );
    }
} 

export default PrivateRoute;