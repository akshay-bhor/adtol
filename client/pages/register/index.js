import RegisterForm from "../../Components/Register/RegisterForm";
import NotAuth from "../../util/NotAuth";

const RegisterPage = () => {
    return (
        <RegisterForm />
    );
}

export default NotAuth(RegisterPage);