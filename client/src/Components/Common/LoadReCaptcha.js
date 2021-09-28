import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { scriptActions } from "../../store//reducers/script.reducer";
import { uiActions } from "../../store/reducers/ui.reducer";
import { scripts, scriptSrc, loadScript, removeScript } from "../../util/load-scripts";

const LoadReCaptcha = () => {
  const dispatch = useDispatch();
  const scriptLoaded = useSelector((state) => state.script.recaptcha);
  
  useEffect(() => {
    const load = async () => {
      // Get id and url
      const id = scripts.RECAPTCHA;
      const src = scriptSrc.RECAPTCHA;

      try {
        await loadScript(id, src);
        dispatch(scriptActions.loadScripts({ scriptName: id, isLoaded: true }));
      } catch (err) {
        dispatch(
          uiActions.showAlert({
            title: "Network Error",
            message:
              "Network error occured, please check your connectivity and refresh the page to proceed!",
          })
        );
      }
    };

    if (!scriptLoaded) load();
  }, [dispatch, scriptLoaded]);

  useEffect(() => {
    // Remove on component unmount
    return () => {
      removeScript(scripts.RECAPTCHA, 'grecaptcha-badge');
      dispatch(scriptActions.loadScripts({ scriptName: scripts.RECAPTCHA, isLoaded: false }));
    }
  }, [dispatch]);

  return null;
};

export default LoadReCaptcha;
