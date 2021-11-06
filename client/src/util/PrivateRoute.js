import { Navigate } from "react-router";
import { validAuthToken } from "./common";

const PrivateRoute = ({Component}) => {
    // Check localstorage token
    if(validAuthToken() !== false) {
        return <Component />
    }
    return (
        <Navigate to={'/register'} />
    );
} 

export default PrivateRoute;