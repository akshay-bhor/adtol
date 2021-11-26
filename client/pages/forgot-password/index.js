import ForgotPassword from "../../Components/Account/ForgotPassword"
import NotAuth from "../../util/NotAuth";

const ForgotPasswordPage = () => {
    return (
        <ForgotPassword />
    );
}

export default NotAuth(ForgotPasswordPage);