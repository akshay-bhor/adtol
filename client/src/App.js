import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import "./App.css";
import Loading from "./Components/UI/Loading";
import Layout from "./Components/Layout/Layout";
import PrivateRoute from "./util/PrivateRoute";

const Home = React.lazy(() => import("./Components/Home/Home"));
const LoginForm = React.lazy(() => import("./Components/Login/LoginForm"));
const Register = React.lazy(() => import("./Components/Register/Register"));
const Logout = React.lazy(() => import("./Components/Logout/Logout"));
const Dashboard = React.lazy(() => import("./Components/Dashboard/Dashboard"));

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

          <Route path="/logout">
            {isAuth && <Logout />}
            {!isAuth && <Redirect to="/" />}
          </Route>

          <Route path="/dashboard" component={PrivateRoute(Dashboard)} />

          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;
