import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper"
import BillingDashboard from "../../../Components/Dashboard/Billing/BillingDashboard";
import PrivateRoute from "../../../util/PrivateRoute";

const BillingPage = () => {
    return (
        <BillingDashboard />
    );
}

export default PrivateRoute(DashboardWrapper(BillingPage));