import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper"
import Publlisher from "../../../Components/Dashboard/Publisher/Publisher";
import PrivateRoute from "../../../util/PrivateRoute";

const PublisherSummary = () => {
    return (
        <Publlisher />
    );
}

export default PrivateRoute(DashboardWrapper(PublisherSummary));