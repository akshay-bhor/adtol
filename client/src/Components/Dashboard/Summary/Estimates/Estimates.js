import { Typography } from "@material-ui/core"
import PaperBlockPrimary from "../../Common/PaperBlockPrimary";

const styles = {
    iblock: {
        display: 'inline-block',
        margin: '20px 10px'
    }
}

const Estimates = (props) => {

    return (
        <PaperBlockPrimary heading={'Estimates'}>

                <div style={styles.iblock}>
                    <Typography variant="caption" display="block">
                        Today so far
                    </Typography>
                    <Typography variant="h4" display="block">
                        ${props.data.todaySum}
                    </Typography>
                </div>

                <div style={styles.iblock}>
                    <Typography variant="caption" display="block">
                        Yesterday
                    </Typography>
                    <Typography variant="h4" display="block">
                        ${props.data.yesterdaySum}
                    </Typography>
                    <Typography variant="subtitle2" display="block">
                        ${props.data.vssamedaylastweek}
                    </Typography>
                    <Typography variant="subtitle2" display="block">
                        vs same day last week
                    </Typography>
                </div>

                <div style={styles.iblock}>
                    <Typography variant="caption" display="block">
                        Last 7 days
                    </Typography>
                    <Typography variant="h4" display="block">
                        ${props.data.sum7days}
                    </Typography>
                    <Typography variant="subtitle2" display="block">
                        ${props.data.sumprev7days}
                    </Typography>
                    <Typography variant="subtitle2" display="block">
                        vs previous 7 days
                    </Typography>
                </div>

                <div style={styles.iblock}>
                    <Typography variant="caption" display="block">
                        This month
                    </Typography>
                    <Typography variant="h4" display="block">
                        ${props.data.sum30days}
                    </Typography>
                    <Typography variant="subtitle2" display="block">
                        ${props.data.sumprev30days}
                    </Typography>
                    <Typography variant="subtitle2" display="block">
                        vs last month
                    </Typography>
                </div>

                <div style={styles.iblock}>
                    <Typography variant="caption" display="block">
                        Balance
                    </Typography>
                    <Typography variant="h4" display="block">
                        ${props.balance}
                    </Typography>
                </div>

        </PaperBlockPrimary>);
}

export default Estimates;