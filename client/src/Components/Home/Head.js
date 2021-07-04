import { Fragment } from "react";
import styles from "./Content.module.css";
import { Link } from 'react-router-dom';
import { Button, makeStyles } from "@material-ui/core";
import interconnected from '../../assets/svg/interconnected.svg';

const useStyle = makeStyles({
    btn: {
        marginTop: '10px'
    }
});

const Head = (props) => {
  const style = useStyle();
  return (
    <Fragment>
      <div className={styles.head_container}>
        <div className={styles.inlinecontainer}>
          <div className={styles.heading}>
            <h1 className={styles.h1}>An AdSense Alternative Ad Network</h1>
            <span className={styles.subheading}>
              Get the best PPC ads for your website traffic. Our advanced
              algorithm ensures highest possible revenue by rendering ads from
              highest bidders for your website.
            </span>
            <div className={[styles.block,styles.mt_5].join(' ')}>
              <Button to='/register' component={Link} className={[style.btn,style.block].join(' ')} variant="contained" color="primary">SIGN UP</Button>
            </div>
          </div>
          <div className={styles.imgcontainer}>
            <img src={interconnected} className={styles.headimg} alt="Adtol" />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Head;
