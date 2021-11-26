import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GOOGLE_CLIENT_ID,
  scripts,
  scriptSrc,
  loadScript,
} from "../../util/load-scripts";
import { scriptActions } from "../../store/reducers/script.reducer";
import { uiActions } from "../../store/reducers/ui.reducer";
import { authActions } from "../../store/reducers/auth.reducer";
import { useRouter } from "next/router";
import { handleOneTapGLogin } from "../../store/actions/auth.action";

const OneTap = () => {
  const dispatch = useDispatch();
  const scriptLoaded = useSelector((state) => state.script.one_tap);
  const needRegister = useSelector((state) => state.auth.requireRegister);
  const router = useRouter();

  const googleSignInHandler = useCallback(
    (response) => {
      let data = {};
      data.gToken = response.credential;
      dispatch(authActions.setGToken(response.credential));
      dispatch(handleOneTapGLogin(data, '/dashboard'));
    },
    [dispatch]
  );

  const initOneTap = useCallback(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: googleSignInHandler,
      });
      window.google.accounts.id.prompt();
    }
  }, [googleSignInHandler]);

  useEffect(() => {
    const loadOneTapScript = async () => {
      const id = scripts.ONETAP;
      const src = scriptSrc.ONETAP;

      try {
        await loadScript(id, src);
        dispatch(scriptActions.loadScripts({ scriptName: id, isLoaded: true }));
        // Init Google
        initOneTap();
      } catch (err) {
        dispatch(
          uiActions.showAlert({
            title: "Network Error",
            message:
              "Network error occured, please check your connectivity and refresh the page!",
          })
        );
      }
    };

    // Check if require Register
    if (needRegister && router.pathname.search("register") === -1) {
      router.push("/register/google");
    } else {
      if (!scriptLoaded) loadOneTapScript();
      else initOneTap();
    }
  }, [scriptLoaded, dispatch, initOneTap, needRegister]);

  return null;
};

export default OneTap;
