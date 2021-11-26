import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper"
import Referrals from "../../../Components/Dashboard/Referrals/Referrals";
import PrivateRoute from "../../../util/PrivateRoute";

const ReferralsPage = () => {
    return (
        <Referrals />
    );
}

export default PrivateRoute(DashboardWrapper(ReferralsPage));