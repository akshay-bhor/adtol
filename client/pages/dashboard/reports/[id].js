import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper"
import Reports from "../../../Components/Dashboard/Reports/Reports";
import PrivateRoute from "../../../util/PrivateRoute";

const ReportsPage = () => {
    return (
        <Reports />
    );
}

export default PrivateRoute(DashboardWrapper(ReportsPage));