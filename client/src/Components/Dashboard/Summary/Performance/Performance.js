import { Typography } from "@material-ui/core"
import styles from './Performance.module.css';
import {makeFriendly} from '../../../../util/common';
import PaperBlock from "../../Common/PaperBlock";

const Performance = (props) => {

    return (
        <PaperBlock heading="Performance" subheading="Today">

                <div className={styles.iblock}>
                    <Typography variant="subtitle2" color="textSecondary" display="block">
                        Impressions
                    </Typography>
                    <Typography variant="h4" display="block">
                        {makeFriendly(props.data.impressions)}
                    </Typography>
                </div>

                <div className={styles.iblock}>
                    <Typography variant="subtitle2" color="textSecondary" display="block">
                        Pops
                    </Typography>
                    <Typography variant="h4" display="block">
                        {makeFriendly(props.data.pops)}
                    </Typography>
                </div>

                <div className={styles.iblock}>
                    <Typography variant="subtitle2" color="textSecondary" display="block">
                        Clicks
                    </Typography>
                    <Typography variant="h4" display="block">
                        {makeFriendly(props.data.clicks)}
                    </Typography>
                </div>

                <div className={styles.iblock}>
                    <Typography variant="subtitle2" color="textSecondary" display="block">
                        CPC
                    </Typography>
                    <Typography variant="h4" display="block">
                        {typeof props.data.cpc === "number" ? '$'+props.data.cpc : props.data.cpc }
                    </Typography>
                </div>

            </PaperBlock>
    );
}

export default Performance;