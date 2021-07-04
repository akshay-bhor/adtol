import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { useHistory } from "react-router";
import { createLogout } from '../../store/actions/auth.action';

const Logout = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(createLogout());
        history.push('/');
    }, [dispatch, history]);

    return(null);
}

export default Logout;