import DashboardWrapper from "../../../../Components/Dashboard/DashboardWrapper"
import Deposit from "../../../../Components/Dashboard/Billing/Deposit/Deposit";
import PrivateRoute from "../../../../util/PrivateRoute";

const DepositPage = () => {
    return (
        <Deposit />
    );
}

export default PrivateRoute(DashboardWrapper(DepositPage));