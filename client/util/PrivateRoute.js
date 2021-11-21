import { useRouter } from "next/router";
import { validAuthToken } from "./common";

const PrivateRoute = WrappedComponent => props => {
    if(typeof window === 'undefined') return null;

    const router = useRouter();

    // Check localstorage token
    if(validAuthToken() !== false) {
        return <WrappedComponent {...props} />
    }
    else {
        router.push('/register');

        return (
            null
        );
    }
} 

export default PrivateRoute;