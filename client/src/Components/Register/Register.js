import { Redirect, Route, Switch } from "react-router";
import RegisterGoogle from "./RegisterGoogle";
import RegisterForm from "./RegisterForm";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { authActions } from "../../store/reducers/auth.reducer";
import { useEffect } from "react";

const Register = () => {
  const gToken = useSelector((state) => state.auth.gToken);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.setRequireRegister(false));
  }, [dispatch])

  return (
    <Switch>
      <Helmet>
        <title>Register - AdTol</title>
      </Helmet>
      <Route path="/register" exact>
        {!gToken && <RegisterForm />}
        {gToken && <Redirect to="/register/google" />}
      </Route>
      <Route path="/register/google">
        {gToken && <RegisterGoogle />}
        {!gToken && <Redirect to="/register" />}
      </Route>
    </Switch>
  );
};

export default Register;
