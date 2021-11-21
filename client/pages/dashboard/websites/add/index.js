import DashboardWrapper from "../../../../Components/Dashboard/DashboardWrapper"
import AddWebsite from "../../../../Components/Dashboard/Websites/AddWebsite";
import PrivateRoute from "../../../../util/PrivateRoute";

const WebsitesAddPage = () => {
    return (
        <AddWebsite />
    );
}

export default PrivateRoute(DashboardWrapper(WebsitesAddPage));