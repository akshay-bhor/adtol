import Head from 'next/head'
import { useEffect } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import store from "../store/store";
import TagManager from "react-gtm-module";
import { useRouter } from "next/router";
import '../styles/globals.css'
import { setOpacity } from "../util/common";
import Layout from "../Components/Layout/Layout";
import AppErrorBoundry from "../Components/AppErrorBoundry/AppErrorBoundry";


const theme = createTheme({
  typography: {
    fontFamily: ["Lato", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: '#531f8b',
      contrast: '#fff'
    },
    secondary: {
      main: '#531f8b',
      contrast: '#fff'
    },
  }
});

setOpacity();

export default function MyApp({ Component, pageProps }) {

  const router = useRouter();
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
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, [router.pathname]);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title>Adtol: The Best PPC/CPM Ad Agency for Publishers & Advertisers</title>  
        <meta
          name="description"
          content="The Best Self Serve CPC/CPM Ad Network with Targeted, Contextual & Native Ads - Pop Ads, Display Ads, SEO Text Ads (PPC/PPV). High Conversions & Fast Payments."
        />
        <link
          href="/favicon.ico"
          rel="icon"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#531f8b" />
      </Head>

      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AppErrorBoundry>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AppErrorBoundry>
        </ThemeProvider>
      </Provider>
    </>
  )
}
