import React, { Suspense, lazy, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import TagManager from "react-gtm-module";
import "./App.css";
import Loading from "./Components/UI/Loading";
import Layout from "./Components/Layout/Layout";
import PrivateRoute from "./util/PrivateRoute";
import AppErrorBoundry from "./Components/AppErrorBoundry/AppErrorBoundry";

/**
 * Lazy Load components
 */
const HomePage = lazy(() => import("./Pages/Home/HomePage"));
const AdvertiserPage = lazy(() => import("./Pages/Advertiser/AdvertiserPage"));
const PublisherPage = lazy(() => import("./Pages/Publisher/PublisherPage"));
const AffililatePage = lazy(() => import("./Pages/Affiliate/AffiliatePage"));
const LoginForm = lazy(() => import("./Components/Login/LoginForm"));
const Register = lazy(() => import("./Components/Register/Register"));
const Logout = lazy(() => import("./Components/Logout/Logout"));
const Dashboard = lazy(() => import("./Components/Dashboard/Dashboard"));
const Account = lazy(() => import("./Components/Account/Account"));
const ForgotPassword = lazy(() => import("./Components/Account/ForgotPassword"));
const ResetPassword = lazy(() => import("./Components/Account/ResetPassword"));
const TermsPage = lazy(() => import("./Pages/Terms/Terms"));
const PrivacyPolicyPage = lazy(() => import("./Pages/PrivacyPolicy/PrivacyPolicy"));
const RefundPolicyPage = lazy(() => import("./Pages/RefundPolicy/RefundPolicy"));
const GuidelinesPage = lazy(() => import("./Pages/Guidelines/Guidelines"));
const ContactPage = lazy(() => import("./Pages/Contact/Contact"));

/** Dashboard Routes */
const Summary = lazy(() => import("./Components/Dashboard/Summary/Summary"));
const Advertiser = lazy(() => import("./Components/Dashboard/Advertiser/Advertiser"));
const CampaignList = lazy(() => import("./Components/Dashboard/Campaigns/CampaignList"));
const Publisher = lazy(() => import("./Components/Dashboard/Publisher/Publisher"));
const WebsiteList = lazy(() => import("./Components/Dashboard/Websites/WebsiteList"));
const EditWebsite = lazy(() => import("./Components/Dashboard/Websites/EditWebsite"));
const AddWebsite = lazy(() => import("./Components/Dashboard/Websites/AddWebsite"));
const AdCode = lazy(() => import("./Components/Dashboard/AdCode/AdCode"));
const Referrals = lazy(() => import("./Components/Dashboard/Referrals/Referrals"));
const BillingDashboard = lazy(() => import("./Components/Dashboard/Billing/BillingDashboard"));
const Withdraw = lazy(() => import("./Components/Dashboard/Billing/Withdraw/Withdraw"));
const Deposit = lazy(() => import("./Components/Dashboard/Billing/Deposit/Deposit"));
const Payment = lazy(() => import("./Components/Dashboard/Billing/Deposit/Payment"));
const Reports = lazy(() => import("./Components/Dashboard/Reports/Reports"));
const CampaignTypes = lazy(() => import("./Components/Dashboard/CreateAd/CampaignTypes"));
const CreateCampaign = lazy(() => import("./Components/Dashboard/CreateAd/CreateCampaign"));
const EditCampaign = lazy(() => import("./Components/Dashboard/CreateAd/EditCampaign"));

function App() {
  const isAuth = useSelector((state) => state.auth.loggedIn);
  const location = useLocation();
  /**
   * Google Tag manager for analytics
   */
  useEffect(() => {
    const tagManagerArgs = {
      gtmId: 'GTM-5HCBT7C'
    }
   
    TagManager.initialize(tagManagerArgs);
  }, []);

  // Track pageViews
  useEffect(() => {
    if(window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview'
      });
    }
  }, [location]);

  return (
    <AppErrorBoundry>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/"
             element={<HomePage />}
            />

            <Route path="/advertiser"
              element={<AdvertiserPage />}
            />

            <Route path="/publisher"
              element={<PublisherPage />}
            />

            <Route path="/affiliate"
              element={<AffililatePage />}
            />

            <Route path="/tos"
              element={<TermsPage />}
            />

            <Route path="/privacy-policy"
              element={<PrivacyPolicyPage />}
            />

            <Route path="/refund-policy"
              element={<RefundPolicyPage />}
            />

            <Route path="/guidelines"
              element={<GuidelinesPage />}
            />

            <Route path="/contact"
              element={<ContactPage />}
            />

            <Route path="/login"
              element={!isAuth ? <LoginForm />:
              <Navigate to="/dashboard" />}
            />

            <Route path="/register"
              element={!isAuth ? <Register />:
              <Navigate to="/dashboard" />}
            />

            <Route path="/forgot-password"
              element={!isAuth ? <ForgotPassword />
              :<Navigate to="/dashboard" />}
            />
 
            <Route path="/reset-password/:token"
              element={!isAuth ? <ResetPassword />
              :<Navigate to="/dashboard" />}
            />

            <Route path="/logout"
              element={<Logout />}
            />

            <Route path="/dashboard/*" element={<PrivateRoute Component={Dashboard} />}>
              <Route path="" element={<Summary />} />
              <Route path="advertiser" element={<Advertiser />} />
              <Route path="campaigns" element={<CampaignList />} />
              <Route path="campaign-type" element={<CampaignTypes />} />
              <Route path="create-ad/:type" element={<CreateCampaign />} />
              <Route path="edit-ad/:type/:campid" element={<EditCampaign />} />
              <Route path="publisher" element={<Publisher />} />
              <Route path="websites" element={<WebsiteList />} />
              <Route path="websites/add" element={<AddWebsite />} />
              <Route
                path="websites/edit/:id"
                element={<EditWebsite />}
              />
              <Route path="get-adcode" element={<AdCode />} />
              <Route path="referrals" element={<Referrals />} />
              <Route
                path="billing"
                element={<BillingDashboard />}
              />
              <Route path="billing/withdraw" element={<Withdraw />} />
              <Route path="billing/deposit" element={<Deposit />} />
              <Route path="billing/payment" element={<Payment />} />
              <Route path="reports/:id" element={<Reports />} />
            </Route>

            <Route path="/account" element={<PrivateRoute Component={Account} />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Layout>
    </AppErrorBoundry>
  );
}

export default App;
