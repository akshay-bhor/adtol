import LoginForm from "../../Components/Login/LoginForm";
import NotAuth from "../../util/NotAuth";

const LoginPage = () => {
    return (
        <LoginForm />
    );
}

export default NotAuth(LoginPage);