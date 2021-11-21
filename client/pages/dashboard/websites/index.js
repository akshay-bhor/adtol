import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper"
import WebsiteList from "../../../Components/Dashboard/Websites/WebsiteList";
import PrivateRoute from "../../../util/PrivateRoute";

const WebsitesListPage = () => {
    return (
        <WebsiteList />
    );
}

export default PrivateRoute(DashboardWrapper(WebsitesListPage));