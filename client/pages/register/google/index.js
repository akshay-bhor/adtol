import NotAuth from "../../../util/NotAuth";
import RegisterGoogle from "../../Components/Register/RegisterGoogle";

const GoogleRegisterPage = () => {
    return (
        <RegisterGoogle />
    );
}

export default NotAuth(GoogleRegisterPage);