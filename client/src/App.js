import React, { Suspense, lazy, useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import { useLocation } from "react-router-dom";
import TagManager from "react-gtm-module";
import "./App.css";
import Loading from "./Components/UI/Loading";
import Layout from "./Components/Layout/Layout";
import PrivateRoute from "./util/PrivateRoute";

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
    <Layout>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>

          <Route path="/advertiser" exact>
            <AdvertiserPage />
          </Route>

          <Route path="/publisher" exact>
            <PublisherPage />
          </Route>

          <Route path="/affiliate" exact>
            <AffililatePage />
          </Route>

          <Route path="/tos" exact>
            <TermsPage />
          </Route>

          <Route path="/privacy-policy" exact>
            <PrivacyPolicyPage />
          </Route>

          <Route path="/refund-policy" exact>
            <RefundPolicyPage />
          </Route>

          <Route path="/guidelines" exact>
            <GuidelinesPage />
          </Route>

          <Route path="/contact" exact>
            <ContactPage />
          </Route>

          <Route path="/login">
            {!isAuth && <LoginForm />}
            {isAuth && <Redirect to="/dashboard" />}
          </Route>

          <Route path="/register">
            {!isAuth && <Register />}
            {isAuth && <Redirect to="/dashboard" />}
          </Route>

          <Route path="/forgot-password">
            {!isAuth && <ForgotPassword />}
            {isAuth && <Redirect to="/dashboard" />}
          </Route>

          <Route path="/reset-password/:token">
            {!isAuth && <ResetPassword />}
            {isAuth && <Redirect to="/dashboard" />}
          </Route>

          <Route path="/logout">
            <Logout />
          </Route>

          <Route path="/dashboard" component={PrivateRoute(Dashboard)} />

          <Route path="/account" component={PrivateRoute(Account)} />

          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;
