import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper"
import CampaignTypes from "../../../Components/Dashboard/CreateAd/CampaignTypes";
import PrivateRoute from "../../../util/PrivateRoute";

const CampaignTypesPage = () => {
    return (<CampaignTypes />)
}

export default PrivateRoute(DashboardWrapper(CampaignTypesPage));