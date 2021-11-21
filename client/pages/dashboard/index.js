import DashboardWrapper from "../../Components/Dashboard/DashboardWrapper";
import Summary from "../../Components/Dashboard/Summary/Summary";
import PrivateRoute from "../../util/PrivateRoute";

const DashboardSummary = () => {
    return (<Summary />);
}

export default PrivateRoute(DashboardWrapper(DashboardSummary));