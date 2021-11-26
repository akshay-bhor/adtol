import DashboardWrapper from "../../../../Components/Dashboard/DashboardWrapper"
import EditCampaign from "../../../../Components/Dashboard/CreateAd/EditCampaign";
import PrivateRoute from "../../../../util/PrivateRoute";

const EditCampaignPage = () => {
    return (
        <EditCampaign />
    );
}

export default PrivateRoute(DashboardWrapper(EditCampaignPage));