import { Box, makeStyles } from "@material-ui/core";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "../../Components/UI/Footer/Footer";
import styles from "../Common/Content.module.css";

const useStyles = makeStyles({
  container: {
    margin: "50px auto",
    maxWidth: "800px",
    fontSize: "1.2em",
    padding: "10px",
  },
});

const RefundPolicy = () => {
  const muiStyles = useStyles();

  return (
    <Fragment>
      <Helmet>
        <title>Refund Policy - AdTol</title>
      </Helmet>
      <Box component="div" className={muiStyles.container}>
        <h2 className={styles.content_heading}>Terms of Service</h2>
        <Box component="div">
          <p>
            These AdTol Refund Terms ("Refund Policy") are entered into by
            "AdTol" and the entity executing these Terms or that accepts these
            Terms electronically ("Customer"). These Terms govern Customer's
            participation in AdTol's advertising programs and services. In
            consideration of the foregoing, the parties agree as follows:
          </p>
          <p>
            Customer authorizes AdTol and its affiliates to place Customer's
            advertising materials and related technology on any content or
            property provided by AdTol or its affiliates on behalf of itself or,
            as applicable, a third party ("Partner"). Customer is solely
            responsible for all: (i) Creative, (ii) Ad trafficking or targeting
            decisions (e.g., keywords) ("Targets"), (iii) Properties to which
            Creative direct viewers (e.g., landing pages) along with the related
            URLs and redirects ("Destinations") and (iv) services and products
            advertised on Destinations (collectively, "Services"). The Program
            is an advertising platform on which Customer authorizes AdTol or its
            affiliates to use automated tools to format Ads.
          </p>
          <p>
            Customer will pay all charges incurred in connection with the
            Program, in immediately available funds or as otherwise approved by
            AdTol, within a commercially reasonable time period specified by
            AdTol.
            <br />
            Any and all deposits are NON-REFUNDABLE.
            <br />
            Disclaimers. EACH PARTY ON BEHALF OF ITSELF AND ITS AFFILIATES
            DISCLAIMS ALL IMPLIED WARRANTIES, INCLUDING WITHOUT LIMITATION FOR
            NON-INFRINGEMENT, SATISFACTORY QUALITY, MERCHANTABILITY AND FITNESS
            FOR ANY PURPOSE. TO THE FULLEST EXTENT PERMITTED BY LAW, THE
            PROGRAMS AND AdTol, ITS AFFILIATES, AND PARTNER PROPERTIES ARE
            PROVIDED "AS IS" AND AT CUSTOMER'S AND ADVERTISER'S OPTION AND RISK
            AND NONE OF AdTol, ITS AFFILIATES OR AdTol'S PARTNERS MAKE ANY
            GUARANTEE IN CONNECTION WITH THE PROGRAMS OR PROGRAM RESULTS.
          </p>
          <p>
            Customers can request to block the service or cancel the ad campaign
            at anytime prior to the start of the next term/session of the
            ongoing campaign. Once the campaign is setup from customer’s end, we
            are not liable to make any refund to the customer. An advertiser can
            at anytime close an advertising campaign created at AdTol Ad
            Network. All remaining budget within that Advertising Campaign will
            return into his AdTol Balance. You are free to use your AdTol
            balance, however, any of the deposits made will be non-refundable.
            We will not take any refund requests and we will not be liable for a
            refund. In any case, if any customer violates the adtol’s{" "}
            <Link to="/tos">Terms and Conditions</Link> or guidelines, we reserve a
            right to block the services offered to the customer without
            refunding any money paid by customer. Customers can take help of
            adtol online chat, phone communication or e-mail communication to
            resolve any issue with adtol services.
          </p>
        </Box>
      </Box>
      <Footer />
    </Fragment>
  );
};

export default RefundPolicy;
