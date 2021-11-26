import DashboardWrapper from "../../../../Components/Dashboard/DashboardWrapper"
import Withdraw from "../../../../Components/Dashboard/Billing/Withdraw/Withdraw";
import PrivateRoute from "../../../../util/PrivateRoute";

const WithdrawPage = () => {
    return (
        <Withdraw />
    );
}

export default PrivateRoute(DashboardWrapper(WithdrawPage));