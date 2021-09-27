import { Fragment } from "react";
import styles from "./Content.module.css";
import { Link } from 'react-router-dom';
import { Button, makeStyles } from "@material-ui/core";

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
            <h1 className={styles.h1}>{props.heading}</h1>
            <span className={styles.subheading}>
              {props.subheading}
            </span>
            <div className={[styles.block,styles.mt_5].join(' ')}>
              <Button to='/register' component={Link} className={[style.btn,style.block].join(' ')} variant="contained" color="primary">SIGN UP</Button>
            </div>
          </div>
          <div className={styles.imgcontainer}>
            <img src={props.headimg} className={styles.headimg} alt="Adtol" />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Head;
