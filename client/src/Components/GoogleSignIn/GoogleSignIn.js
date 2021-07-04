import { useCallback, useEffect, useRef } from "react";
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

const GoogleSignIn = (props) => {
  const dispatch = useDispatch();
  const scriptLoaded = useSelector((state) => state.script.one_tap);
  const gBtnRef = useRef();

  const googleSignInHandler = useCallback(
    (response) => {
      dispatch(authActions.setGToken(response.credential));
      if (props.onSuccess) props.onSuccess(response.credential);
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
      window.google.accounts.id.renderButton(gBtnRef.current, {
        theme: 'filled_blue',
        size: 'large',
      });
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

    if (!scriptLoaded) loadOneTapScript();
    else initOneTap();
  }, [scriptLoaded, dispatch, initOneTap]);

  return <div ref={gBtnRef} id="googleSignInBtnContainer" style={{marginTop: '10px'}}></div>;
};

export default GoogleSignIn;
