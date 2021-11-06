import { Fragment, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import RegisterGoogle from "./RegisterGoogle";
import RegisterForm from "./RegisterForm";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { authActions } from "../../store/reducers/auth.reducer";

const Register = () => {
  const gToken = useSelector((state) => state.auth.gToken);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.setRequireRegister(false));
  }, [dispatch])

  return (
    <Fragment>
      <Helmet>
        <title>Register - AdTol</title>
      </Helmet>
      <Routes>
        <Route path="/register"
          element={!gToken ? <RegisterForm />
          : <Navigate to="/register/google" />}
        />
        <Route path="/register/google"
          element={gToken ? <RegisterGoogle />
          : <Navigate to="/register" />}
        />
      </Routes>
    </Fragment>
  );
};

export default Register;
