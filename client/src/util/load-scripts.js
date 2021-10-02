export const RECAPTCHA_SITE_KEY = "6LcIF9waAAAAAM6J1cr9odD8vAi3Yh73Gi2HqG16";
export const GOOGLE_CLIENT_ID =
  "533810574933-hlh07fjana2kbf05m4ui6h5jhlactp1k.apps.googleusercontent.com";
export const MAPS_API_KEY = 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY';

// Scripts selector
export const scripts = {
  RECAPTCHA: "recaptcha",
  ONETAP: "one_tap",
  GCHARTS: "g_charts",
  RZRPAY: "rzr_pay"
};

export const scriptSrc = {
  RECAPTCHA: `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`,
  ONETAP: `https://accounts.google.com/gsi/client`,
  GCHARTS: `https://www.gstatic.com/charts/loader.js`,
  RZRPAY: `https://checkout.razorpay.com/v1/checkout.js`,
};

export const loadScript = (id, url) => {
  return new Promise((resolve, reject) => {
    let scriptExist = document.getElementById(id);

    if (!scriptExist) {
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      script.id = id;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = (error) => {
        reject(false);
      };
      document.getElementsByTagName("head")[0].appendChild(script);
    } else {
      resolve(true);
    }
  });
};

export const removeScript = (id, className = null) => {
  const script = document.getElementById(id);
  if(script) { script.remove(); }
  if(className !== null && className !== undefined) { 
    const ele = document.getElementsByClassName(className);
    if(ele[0]) ele[0].remove();
  }
}
