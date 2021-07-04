import { Redirect } from "react-router";
import { validAuthToken } from "./common";

const PrivateRoute = WrappedComponent => props => {
    // Check localstorage token
    if(validAuthToken() !== false) {
        return (<WrappedComponent {...props} />)
    }
    return (
        <Redirect to={'/register'} />
    );
} 

export default PrivateRoute;