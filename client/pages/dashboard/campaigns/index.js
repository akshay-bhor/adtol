import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper"
import CampaignsList from "../../../Components/Dashboard/Campaigns/CampaignList";
import PrivateRoute from "../../../util/PrivateRoute";

const CampaignList = () => {
    return (
        <CampaignsList />
    );
}

export default PrivateRoute(DashboardWrapper(CampaignList));