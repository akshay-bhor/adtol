import DashboardWrapper from "../../../../Components/Dashboard/DashboardWrapper"
import Payment from "../../../../Components/Dashboard/Billing/Deposit/Payment";
import PrivateRoute from "../../../../util/PrivateRoute";

const PaymentPage = () => {
    return (
        <Payment />
    );
}

export default PrivateRoute(DashboardWrapper(PaymentPage));