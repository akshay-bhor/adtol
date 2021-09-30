import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { createLogout } from '../../store/actions/auth.action';

const Logout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(createLogout());
        document.location = '/login';
    }, [dispatch]);

    return(null);
}

export default Logout;