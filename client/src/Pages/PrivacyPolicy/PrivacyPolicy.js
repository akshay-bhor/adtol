import { Box, makeStyles } from "@material-ui/core";
import { Fragment } from "react";
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

const PrivacyPolicy = () => {
  const muiStyles = useStyles();

  return (
    <Fragment>
      <Box component="div" className={muiStyles.container}>
        <h2 className={styles.content_heading}>Privacy Policy</h2>
        <Box component="div">
          <p>
            At Adtol we recognize that privacy is important. This Privacy Policy
            applies to all products and services provided by us
            ("Adtol/Services").
          </p>
          <h3>Collection of Information</h3>
          <p>
            We collect various information when you register with our Company,
            during your use of our products and services, when you visit pages
            of our partners. We may combine information about you that we have
            with information we obtain from other partners or other companies in
            order to provide you a better experience or to improve the quality
            of our services. When you sign into our services, you are not
            anonymous to us. We automatically receive and record information
            from your computer and browser, including your IP address, our
            cookie information, software and hardware attributes, the page you
            request and other standard browser parameters.
          </p>
          <p>
            When you use our services, we send one or more cookies - a small
            file containing a string of characters - to your device that
            uniquely identifies your browser. We use cookies to improve the
            quality of our service, including for storing user preferences,
            tracking user trends, and providing you with a better experience. We
            may set one or more cookies in your browser when you use our
            services or one of our partner's services. When you send messages,
            publish content, post material, transmit information or email
            through our services, we may retain the same in order to process
            your inquiries, respond to your requests and improve our services.
          </p>
          <p>
            Our infrastructure consists of servers deployed at multiple data
            centers that are owned and operated by us or our partners. All
            information collected within our services resides on this network of
            servers.
          </p>
          <h3>Use of Information</h3>
          We only use and process personal information for the purposes
          described in this Privacy Policy. In addition to the above, such
          purposes include:
          <ol>
            <li>Communicating with you</li>
            <li>
              Making the sites or services easier to use by eliminating the need
              for you to repeatedly enter the same information
            </li>
            <li>Providing our services</li>
            <li>
              Auditing, research and analysis in order to maintain, protect and
              improve our services
            </li>
            <li>Ensuring the technical functioning of our network</li>
            <li>Protecting our rights or property and that of our users</li>
            <li>Developing new services</li>
            <li>
              As described in the respective terms of service of each of our
              services and in the Adtol Customer Master Agreement
            </li>
          </ol>
          <h3>No-Spam Policy</h3>
          <p>
            We have a strict No-Spam Policy prohibiting the use of any data
            collected to send spam. We will not sell any contact information to
            third parties.
          </p>
          <h3>Choices for Personal Information</h3>
          <p>
            When you sign up for a particular service that requires
            registration, we ask you to provide personal information. If we use
            this information in a manner different than the purpose defined
            herein and in the terms of the services offered then we will ask for
            your consent prior to such use. Most browsers are initially set up
            to accept cookies, but you can reset your browser to refuse all
            cookies or to indicate when a cookie is being sent. However, some of
            our features and services may not function properly if your cookies
            are disabled. You can decline to submit personal information to any
            of our services, in which case we may not be able to provide those
            services to you.
          </p>
          <h3>Information Sharing</h3>
          We only share personal information with other companies or individuals
          in the following limited circumstances:
          <ol>
            <li>We have your consent</li>
            <li>
              Sharing the information with our subsidiaries, affiliated
              companies or other trusted businesses or persons for the purpose
              of processing personal information on our behalf. We require that
              these parties agree to process such information based on our
              instructions and in compliance with this Privacy Policy and any
              other appropriate confidentiality and security measures.
            </li>
            <li>
              We have a good faith belief that access, use, preservation or
              disclosure of such information is reasonably necessary to:
              <ul>
                <li>
                  (a) satisfy any applicable law, regulation, legal process or
                  enforceable governmental request,
                </li>
                <li>
                  (b) enforce applicable Terms of Service, including
                  investigation of potential violations thereof,
                </li>
                <li>
                  (c) detect, prevent, or otherwise address fraud, security or
                  technical issues, or
                </li>
                <li>
                  (d) protect against harm to rights, property or safety, of our
                  users, us or the public as required or permitted by law.
                </li>
              </ul>
            </li>
            <li>
              We may share with third parties certain pieces of aggregated,
              non-personal information, such as the number of users by
              demographic. Such information does not identify you individually.
            </li>
            <li>
              As permitted and described in the respective terms of service of
              each of our services and in the Adtol Customer Master Agreement
            </li>
          </ol>
          <h3>Information Security</h3>
          <p>
            We take appropriate security measures to protect against
            unauthorized access to or unauthorized alteration, disclosure or
            destruction of data. These include internal reviews of our data
            collection, storage and processing practices and security measures,
            as well as physical security measures to guard against unauthorized
            access to systems where we store personal data.
          </p>
          <p>
            We restrict access to personal information to our employees,
            contractors, and agents who need to know that information in order
            to operate, develop or improve our services. These individuals are
            bound by confidentiality obligations and may be subject to
            discipline, including termination and criminal prosecution if they
            fail to meet these obligations.
          </p>
          <h3>Accessing and Updating Personal Information</h3>
          <p>
            When you use our services, we make good faith efforts to provide you
            with access to your personal information and to correct this data if
            it is inaccurate.
          </p>
          <h3>Changes to this Privacy Policy</h3>
          <p>
            Please note that this Privacy Policy may change from time to time.
          </p>
        </Box>
      </Box>
      <Footer />
    </Fragment>
  );
};

export default PrivacyPolicy;
