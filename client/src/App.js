import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import "./App.css";
import Loading from "./Components/UI/Loading";
import Layout from "./Components/Layout/Layout";
import PrivateRoute from "./util/PrivateRoute";

/**
 * Lazy Load components
 */
const Home = lazy(() => import("./Components/Home/Home"));
const LoginForm = lazy(() => import("./Components/Login/LoginForm"));
const Register = lazy(() => import("./Components/Register/Register"));
const Logout = lazy(() => import("./Components/Logout/Logout"));
const Dashboard = lazy(() => import("./Components/Dashboard/Dashboard"));
const Account = lazy(() => import("./Components/Account/Account"));
const ForgotPassword = lazy(() => import("./Components/Account/ForgotPassword"));
const ResetPassword = lazy(() => import("./Components/Account/ResetPassword"));

function App() {
  const isAuth = useSelector((state) => state.auth.loggedIn);

  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/" exact>
            <Home />
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
            {isAuth && <Logout />}
            {!isAuth && <Redirect to="/" />}
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
