import { Box, Grid, makeStyles } from "@material-ui/core";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "../../Components/UI/Footer/Footer";
import styles from "../Common/Content.module.css";

const useStyles = makeStyles({
  container: {
    margin: "50px auto",
    maxWidth: "100%",
    fontSize: "1.2em",
  },
  guidelines: {
    border: '2px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    boxSizing: 'border-box'
  }
});

const Guidelines = () => {
  const muiStyles = useStyles();

  return (
    <Fragment>
      <Helmet>
        <title>Guidelines</title>
      </Helmet>
      <Box component="div" className={muiStyles.container}>
        <Grid container>
          <Grid item sm={12} md={6} className={muiStyles.guidelines}>
            <h2 className={styles.content_heading}>Publisher Guidelines</h2>
            <Box component="div">
              <h3>Understanding Our Guidelines</h3>
              <p>
                Our Publishing Guidelines provide guidance on what types of the
                requirements is needed to meet our compliance. When publisher
                adds a website/websites, each site is reviewed against these
                policies. If you think that your campaign was not approved by
                mistake, please <Link to="/contact">let us know</Link>.
              </p>
              <h3>Review Process</h3>
              <p>
                Before your campaign starts running, our ad experts review your
                website against our publishing policies. Typically, most sites
                are reviewed in 24 hours, but in some cases, it may take longer.
              </p>
              <p>
                During the review process, we check your website's quality and
                content. Your campaign may not get approved if your website is
                not fully functional or does not meet our guidelines.
              </p>
              <p>
                After your website has been reviewed, you'll receive a
                notification letting you know whether your website has been
                approved. If it's approved, we'll start running your campaign,
                and you will be able to see your results on your dashboard.
              </p>
              <h3>Steps to take if your website is disapproved</h3>
              <p>
                If your campaign has not been approved due to not fully
                complying with our guidelines, you can edit and resubmit for it
                for review as many times you want. If your campaign has been
                disapproved, we will send you an email notification along with
                reasons why and information to make it more compliant with our
                standards. After making changes, you can resubmit it for review.
              </p>
              <h3>Minimum Requirement</h3>
              <h4>No illegal content, products, and services</h4>
              <p>
                Your website must not contain, facilitate or promote illegal
                products, content, services or activities, inappropriate,
                illegal, and unsafe.
              </p>
              <h4>No Malware and Spyware</h4>
              <p>
                Your website or webpage must not contain, implicate, or links to
                any sorts of spyware, malware, or software that may result in
                harmful user experience.
              </p>
              <h4>Should not be incomplete or under construction</h4>
              <p>
                Your website must be fully functional in order to run our ads,
                any sorts of incomplete website or web pages are not allowed in
                order to keep our standards.
              </p>
              <h4>Misleading or False Content</h4>
              <p>
                Your website must not contain any misleading, deceptive content
                including deceitful business offers and claims.
              </p>
              <h4>No excessive advertisement</h4>
              <p>
                Your website must not contain any sorts of extreme advertisement
                that may result in bad user experience.
              </p>
              <h4>No violent and disrespectful content</h4>
              <p>
                Your website must not contain shocking, sensational,
                disrespectful or excessively violent content. This includes
                direct or indirect assertions or implications about a person's
                race, religion, ethnic origin, age, sexual orientation or
                practices, beliefs, gender identity.
              </p>
              <h4>Unique Visitors</h4>
              <p>
                Your website must have natural traffic of atleast 200 unique
                visitors per day.
              </p>
              <h4>Proper Information</h4>
              <p>
                While creating your ad campaign, you must fill out proper and
                correct information. Any misleading information may cause
                immediate ban or diapproval. This includes selecting adult, if
                you have nsfw content.
              </p>
              <p>
                For more information, please visit{" "}
                <Link to="/tos">terms of service</Link>.
              </p>
            </Box>
          </Grid>
          <Grid item sm={12} md={6} className={muiStyles.guidelines}>
            <h2 className={styles.content_heading}>Advertiser Guidelines</h2>
            <Box component="div">
              <h3>Understanding Our Guidelines</h3>
              <p>
                Our Advertising Guidelines provide guidance on what types of
                advertising content is allowed. When advertisers place an order,
                each ad is reviewed against these policies. If you think that
                your ad was not approved by mistake, please{" "}
                <Link to="/contact">let us know.</Link>
              </p>
              <h3>Review Process</h3>
              <p>
                Before your campaign starts running, our ad experts review your
                ad against our advertising policies. Typically, most ads are
                reviewed in 24 hours, but in some cases, it may take longer.
              </p>
              <p>
                During the review process, we check your ad quality, text,
                image, targeting, landing page. Your ad may not get approved if
                your landing page is not fully functional, does not match to the
                content advertised, and does not meet our guidelines.
              </p>
              <p>
                After your ad has been reviewed, you'll receive a notification
                letting you know whether your ad has been approved. If it's
                approved, we'll start running your ad, and you will be able to
                see your results on your dashboard.
              </p>
              <h3>Steps to take if your ad is disapproved</h3>
              <p>
                If your ad has not been approved due to not fully complying with
                our guidelines, you can edit and resubmit for it for review as
                many times you want. If your ad has been disapproved, we will
                send you an email notification along with reasons and
                information to make it more compliant. After making changes to
                your ad, you can resubmit it for review.
              </p>
              <h3>Prohibited Content</h3>
              <h4>Illegal content, products, and services</h4>
              <p>
                Your ad must not contain, facilitate or promote illegal
                products, content, services or activities. Ads targeted to
                minors must not contain, or promote products, services, or
                content that are inappropriate, illegal, and unsafe.
              </p>
              <h4>Discriminary Practices</h4>
              <p>
                Your Ad must not engage in predatory advertising practices or
                contain content that discriminates against, harasses, provokes
                or disparages people who use our and our partner's services.
              </p>
              <h4>Copyright infringment</h4>
              <p>
                Ad must not contain any content that infringes on or violates
                the rights of any third party, including copyright, trademark,
                privacy, publicity or other personal or proprietary rights. To
                report such content that violets or infringe your rights,{" "}
                <Link to="/contact">contact us</Link>.
              </p>
              <h4>Violent and disrespectful content</h4>
              <p>
                Your ad must not contain shocking, sensational, disrespectful or
                excessively violent content. This includes direct or indirect
                assertions or implications about a person's race, religion,
                ethnic origin, age, sexual orientation or practices, beliefs,
                gender identity.
              </p>
              <h4>Misleading or False Content</h4>
              <p>
                Your ad must not contain any false, deceptive content including
                deceptive offers and claims.
              </p>
              <h4>Contraversial Content</h4>
              <p>
                Ad must not contain content that exploits controversial
                political or social issues for commercial purposes.
              </p>
              <h4>Malware and Spyware</h4>
              <p>
                Your ad and landing page must not contain, implicate, or links
                to any sorts of spyware, malware, or software that may result in
                bad user experiance.
              </p>
              <p>
                For more details, please read our{" "}
                <Link to="/tos">terms of service</Link>.
              </p>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Fragment>
  );
};

export default Guidelines;
