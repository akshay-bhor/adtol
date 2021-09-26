import { Fragment } from "react";
import styles from './Content.module.css';
import { Icon, makeStyles } from "@material-ui/core";

const useStyle = makeStyles(theme => ({
    bigicon: {
        fontSize: '36px',
        color: theme.palette.primary.main
    }
}));

const Bottom = () => {
    const muistyles = useStyle();

    return (
        <Fragment>
            <h3 className={styles.content_heading}>Our Key Advantages</h3>
            <div className={styles.key_container}>
                <div className={styles.bottominlinecontainer}>

                    <div className={styles.adv_container}>
                        <div className={styles.icon}>
                            <Icon className={muistyles.bigicon}>flash_on</Icon>
                        </div>
                        <div className={styles.adv_content}>
                            <div className={styles.bold}>Fast Payments</div>
                            <div className={styles.normal}>Pay with integrated payment gateway with no barrier of currency</div>
                        </div>
                    </div>

                    <div className={styles.adv_container}>
                        <div className={styles.icon}>
                            <Icon className={muistyles.bigicon}>settings</Icon>
                        </div>
                        <div className={styles.adv_content}>
                            <div className={styles.bold}>Unparalleled Service Quality</div>
                            <div className={styles.normal}>Our ad-experts always ready at your service 24/7.</div>
                        </div>
                    </div>

                    <div className={styles.adv_container}>
                        <div className={styles.icon}>
                            <Icon className={muistyles.bigicon}>dashboard</Icon>
                        </div>
                        <div className={styles.adv_content}>
                            <div className={styles.bold}>Friendly Interface</div>
                            <div className={styles.normal}>Manage your ad-campaign from easy-to-use dashboard.</div>
                        </div>
                    </div>

                    <div className={styles.adv_container}>
                        <div className={styles.icon}>
                            <Icon className={muistyles.bigicon}>contact_support</Icon>
                        </div>
                        <div className={styles.adv_content}>
                            <div className={styles.bold}>Dedicated Support</div>
                            <div className={styles.normal}>We ofer lightning fast support via E-Mail, Chat, and Skype.</div>
                        </div>
                    </div>

                    <div className={styles.adv_container}>
                        <div className={styles.icon}>
                            <Icon className={muistyles.bigicon}>public</Icon>
                        </div>
                        <div className={styles.adv_content}>
                            <div className={styles.bold}>Worldwide Coverage</div>
                            <div className={styles.normal}>Easy-to-reach anywhere in the globe with 80% coverage of the web.</div>
                        </div>
                    </div>

                    <div className={styles.adv_container}>
                        <div className={styles.icon}>
                            <Icon className={muistyles.bigicon}>speed</Icon>
                        </div>
                        <div className={styles.adv_content}>
                            <div className={styles.bold}>Performance</div>
                            <div className={styles.normal}>With highly targeted options, optimization is never been easier!</div>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    );
}

export default Bottom;