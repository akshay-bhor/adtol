import { Box, makeStyles } from "@material-ui/core";
import { Fragment } from "react";
import Head from "next/head";
import Footer from "../../UI/Footer/Footer";
import styles from "../Common/Content.module.css";

const useStyles = makeStyles({
  container: {
    margin: "50px auto",
    maxWidth: "800px",
    fontSize: '1.2em',
    padding: '10px'
  },
});

const Terms = () => {
  const muiStyles = useStyles();

  return (
    <Fragment>
      <Head>
        <title>Terms of Service - AdTol</title>
      </Head>
      <Box component="div" className={muiStyles.container}>
        <h2 className={styles.content_heading}>Terms of Service</h2>
        <Box component="div">
          <p>
            These AdTol Advertising Terms ("Terms") are entered into by "AdTol"
            and the entity executing these Terms or that accepts these Terms
            electronically ("Customer"). These Terms govern Customer's
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
            Customer will not provide Ads containing malware, spyware or any
            other malicious code or knowingly breach or circumvent any Program
            security measure.
          </p>
          <p>
            Unless a Policy, the Program user interface or an agreement
            referencing these Terms (an "IO") provides otherwise, either party
            may cancel any Ad at any time before the earlier of Ad auction or
            placement. Cancelled Ads will generally cease serving within 8
            business hours or as described in a Policy or IO. Customer must
            effect cancellation of Ads online through Customer's account("Ad
            Cancellation Process"). AdTol will not be bound by a Customer
            provided IO.
          </p>
          <p>
            Customer warrants that (a) it holds and hereby grants AdTol, its
            affiliates, and Partners, the rights in Creative, Destinations and
            Targets for AdTol, its affiliates and Partners to operate the
            Programs and (b) all information and authorizations provided by
            Customer are complete, correct and current. Customer authorizes
            AdTol and its affiliates to automate retrieval and analysis of
            Destinations for the purposes of the Programs. Customer warrants
            that it is authorized to act on behalf of, and has bound to these
            Terms, third parties, if any, for which Customer advertises in
            connection with these Terms ("Advertiser").
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
            Limitation of Liability. TO THE FULLEST EXTENT PERMITTED BY LAW
            REGARDLESS OF THE THEORY OR TYPE OF CLAIM: (a) NO PARTY OR ITS
            AFFILIATES MAY BE HELD LIABLE UNDER THESE TERMS OR ARISING OUT OF OR
            RELATED TO PERFORMANCE OF THESE TERMS FOR ANY DAMAGES OTHER THAN
            DIRECT DAMAGES, EVEN IF THE PARTY IS AWARE OR SHOULD KNOW THAT SUCH
            DAMAGES ARE POSSIBLE AND EVEN IF DIRECT DAMAGES DO NOT SATISFY A
            REMEDY; AND (b) OTHER THAN CUSTOMER'S PAYMENT OBLIGATIONS UNDER
            THESE TERMS, NO PARTY OR ITS AFFILIATES MAY BE HELD LIABLE FOR
            DAMAGES UNDER THESE TERMS OR ARISING OUT OF OR RELATED TO
            PERFORMANCE OF THESE TERMS FOR ANY GIVEN EVENT OR SERIES OF
            CONNECTED EVENTS IN THE AGGREGATE OF MORE THAN THE AMOUNT PAYABLE TO
            AdTol BY CUSTOMER UNDER THE TERMS IN THE THIRTY DAYS BEFORE THE DATE
            OF THE ACTIVITY FIRST GIVING RISE TO THE CLAIM.
          </p>
          <p>
            Indemnification. Customer will defend, indemnify and hold harmless
            AdTol, its Partners, agents, affiliates, and licensors from any
            third party claim or liability arising out of or related to Targets,
            Creative, Destinations, Services, Use and breach of these Terms by
            Customer. Partners are intended third party beneficiaries of this
            Section.
          </p>
          <p>
            Term. AdTol may add to, delete from or modify these Terms at any
            time without liability. The customer should look at these Terms
            regularly. The changes to the Terms will not apply retroactively and
            will become effective 7 days after posting. Either party may
            terminate these Terms at any time with notice to the other party.
            The parties agree to waive any provisions of local law which may
            limit, restrict, require a court order or otherwise inhibit AdTol's
            ability to terminate these Terms at its sole discretion. AdTol may
            suspend Customer's ability to participate in the Programs at any
            time. In all cases, the running of any Customer campaigns after
            termination is in AdTol's sole discretion.
          </p>
        </Box>
      </Box>
      <Footer />
    </Fragment>
  );
};

export default Terms;
