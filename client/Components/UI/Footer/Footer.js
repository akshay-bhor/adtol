import styles from "./Footer.module.css";
import Link from "next/link";
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
          <Link href='/affiliate'>
            <a className={styles.block}>Affiliates</a>
          </Link>
          <Link href='/advertiser'>
            <a className={styles.block}>Advertisers</a>
          </Link>
          <Link href='/publisher'>
            <a className={styles.block}>Publishers</a>
          </Link>
          <Link href='/contact'>
            <a className={styles.block}>Contact</a>
          </Link>
        </div>
        <div className={styles.footer_item}>
          <h3>Quick Links</h3>
          <Link href='/tos'>
            <a className={styles.block}>Terms of Service</a>
          </Link>
          <Link href='/privacy-policy'>
            <a className={styles.block}>Privacy Policy</a>
          </Link>
          <Link href='/refund-policy'>
            <a className={styles.block}>Refund Policy</a>
          </Link>
          <Link href='/guidelines'>
            <a className={styles.block}>Guidelines</a>
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
