import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/reducers/ui.reducer";
import Modal from "../UI/Modal";
import { autoLogin } from "../../store/actions/auth.action";
import Navbar from "../UI/Navigation/Navbar";
import OneTap from "../GoogleSignIn/OneTap";
import SnackBar from "../UI/SnackBar";
import { useRouter } from "next/router";

const Layout = (props) => {
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const needRedirect = useSelector((state) => state.auth.redirect);
  const [initial, setInitial] = useState(true);
  const alert = useSelector((state) => state.ui.alert);
  const snack = useSelector((state) => state.ui.snack);
  const router = useRouter();

  useEffect(() => {
    if(needRedirect) {
      router.push(needRedirect);
    }
  }, [needRedirect]);

  if (initial) {
    setInitial(false);
    dispatch(autoLogin());
  }

  const clearAlert = () => {
    dispatch(uiActions.clearAlert());
  };

  const clearSnack = () => {
    dispatch(uiActions.clearSnack());
  };

  let navName = "AdTol";
  if (router.pathname.search("dashboard") !== -1) navName = "Dashboard";

  return (
    <Fragment>
      {!initial && !loggedIn && <OneTap />}
      {alert && (
        <Modal title={alert.title} onClose={clearAlert}>
          {alert.message}
        </Modal>
      )}
      {snack && (
        <SnackBar severity={snack.severity} onClose={clearSnack} message={snack.message} />
      )}
      <Navbar name={navName} />
      <main>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
