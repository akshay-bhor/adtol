import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper"
import Advertiser from "../../../Components/Dashboard/Advertiser/Advertiser";
import PrivateRoute from "../../../util/PrivateRoute";

const AdvertiserSummary = () => {
    return (
        <Advertiser />
    );
}

export default PrivateRoute(DashboardWrapper(AdvertiserSummary));