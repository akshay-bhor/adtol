import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper"
import AdCode from "../../../Components/Dashboard/AdCode/AdCode";
import PrivateRoute from "../../../util/PrivateRoute";

const GetAdcodePage = () => {
    return (
        <AdCode />
    );
}

export default PrivateRoute(DashboardWrapper(GetAdcodePage));