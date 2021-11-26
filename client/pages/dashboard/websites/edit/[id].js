import DashboardWrapper from "../../../../Components/Dashboard/DashboardWrapper"
import EditWebsite from "../../../../Components/Dashboard/Websites/EditWebsite";
import PrivateRoute from "../../../../util/PrivateRoute";

const WebsitesEditPage = () => {
    return (
        <EditWebsite />
    );
}

export default PrivateRoute(DashboardWrapper(WebsitesEditPage));