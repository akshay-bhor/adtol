import styles from "./Footer.module.css";
import { Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  footer: {
    background: theme.palette.primary.main,
  }
}))

const Footer = () => {
  const muiStyles = useStyles();

  return (
    <div className={`${muiStyles.footer} ${styles.footer}`}>
      <div className={styles.footer_content}>
        <div className={styles.footer_item}>
          <h3>Network</h3>
          <Link to='/affiliate' className={styles.block}>
            Affiliates
          </Link>
          <Link to='/advertiser' className={styles.block}>
            Advertisers
          </Link>
          <Link to='/publisher' className={styles.block}>
            Publishers
          </Link>
          <Link to='/contact' className={styles.block}>
            Contact
          </Link>
        </div>
        <div className={styles.footer_item}>
          <h3>Quick Links</h3>
          <Link to='/tos' className={styles.block}>
            Terms of Service
          </Link>
          <Link to='/privacy-policy' className={styles.block}>
            Privacy Policy
          </Link>
          <Link to='/refund-policy' className={styles.block}>
            Refund Policy
          </Link>
          <Link to='/guidelines' className={styles.block}>
            Guidelines
          </Link>
        </div>
        <div className={styles.footer_item}>
          <h3>Contact Us</h3>
          <span className={styles.block}>College Road</span>
          <span className={styles.block}>Warulwadi, Naryangaon</span>
          <span className={styles.block}>Pune - 410504</span>
          <span className={styles.block}>Email: adtol.com@gmail.com</span>
        </div>
      </div>
      <div className={styles.footer_bottom}>&copy; {new Date().getFullYear()}, AdTol Advertising Network, All Rights Reserved.</div>
    </div>
  );
};

export default Footer;
