import ResetPassword from "../../Components/Account/ResetPassword"
import NotAuth from "../../util/NotAuth"

const ResetPasswordPage = () => {
    return (
        <ResetPassword />
    );
}

export default NotAuth(ResetPasswordPage);