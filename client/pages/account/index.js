import PrivateRoute from "../../util/PrivateRoute";
import Account from "../../Components/Account/Account";

const AccountPage = () => {
    return (
        <Account />
    );
}

export default PrivateRoute(AccountPage);