import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper"
import CreateCampaign from "../../../Components/Dashboard/CreateAd/CreateCampaign";
import PrivateRoute from "../../../util/PrivateRoute";

const CreateAdPage = () => {
    return (
        <CreateCampaign />
    );
}

export default PrivateRoute(DashboardWrapper(CreateAdPage));