import { Fragment } from "react";
import styles from './Content.module.css';
import FlashOnRoundedIcon from '@material-ui/icons/FlashOnRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import ContactSupportRoundedIcon from '@material-ui/icons/ContactSupportRounded';
import PublicRoundedIcon from '@material-ui/icons/PublicRounded';
import SpeedRoundedIcon from '@material-ui/icons/SpeedRounded';
import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles({
    bigicon: {
        fontSize: '36px'
    }
});

const Bottom = (props) => {
    const muistyles = useStyle();

    return (
        <Fragment>
            <h3 className={styles.content_heading}>Our Key Advantages</h3>
            <div className={styles.key_container}>
                <div className={styles.bottominlinecontainer}>

                    <div className={styles.adv_container}>
                        <div className={styles.icon}>
                            <FlashOnRoundedIcon className={muistyles.bigicon} />
                        </div>
                        <div className={styles.adv_content}>
                            <div className={styles.bold}>Fast Payments</div>
                            <div className={styles.normal}>Pay with integrated payment gateway with no barrier of currency</div>
                        </div>
                    </div>

                    <div className={styles.adv_container}>
                        <div className={styles.icon}>
                            <SettingsRoundedIcon className={muistyles.bigicon} />
                        </div>
                        <div className={styles.adv_content}>
                            <div className={styles.bold}>Unparalleled Service Quality</div>
                            <div className={styles.normal}>Our ad-experts always ready at your service 24/7.</div>
                        </div>
                    </div>

                    <div className={styles.adv_container}>
                        <div className={styles.icon}>
                            <DashboardRoundedIcon className={muistyles.bigicon} />
                        </div>
                        <div className={styles.adv_content}>
                            <div className={styles.bold}>Friendly Interface</div>
                            <div className={styles.normal}>Manage your ad-campaign from easy-to-use dashboard.</div>
                        </div>
                    </div>

                    <div className={styles.adv_container}>
                        <div className={styles.icon}>
                            <ContactSupportRoundedIcon className={muistyles.bigicon} />
                        </div>
                        <div className={styles.adv_content}>
                            <div className={styles.bold}>Dedicated Support</div>
                            <div className={styles.normal}>We ofer lightning fast support via E-Mail, Chat, and Skype.</div>
                        </div>
                    </div>

                    <div className={styles.adv_container}>
                        <div className={styles.icon}>
                            <PublicRoundedIcon className={muistyles.bigicon} />
                        </div>
                        <div className={styles.adv_content}>
                            <div className={styles.bold}>Worldwide Coverage</div>
                            <div className={styles.normal}>Easy-to-reach anywhere in the globe with 80% coverage of the web.</div>
                        </div>
                    </div>

                    <div className={styles.adv_container}>
                        <div className={styles.icon}>
                            <SpeedRoundedIcon className={muistyles.bigicon} />
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