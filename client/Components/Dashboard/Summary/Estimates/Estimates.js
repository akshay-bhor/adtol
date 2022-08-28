import { Tooltip, Typography, Box } from "@material-ui/core"
import PaperBlockPrimary from "../../Common/PaperBlockPrimary";

const styles = {
    iblock: {
        display: 'inline-block',
        margin: '20px 10px'
    }
}

const Estimates = (props) => {

    return (
        <PaperBlockPrimary heading={props.selected === 1 ? 'Spending':'Earning'}>

                <div style={styles.iblock}>
                    <Typography variant="caption" display="block">
                        Today so far
                    </Typography>
                    <Typography variant="h4" display="block">
                        <Tooltip title={+props.data.todaySum} arrow>
                            <Box>${(parseFloat(props.data.todaySum).toFixed(2)).toLocaleString()}</Box>
                        </Tooltip>
                    </Typography>
                </div>

                <div style={styles.iblock}>
                    <Typography variant="caption" display="block">
                        Yesterday
                    </Typography>
                    <Typography variant="h4" display="block">
                        <Tooltip title={+props.data.yesterdaySum} arrow>
                            <Box>${(parseFloat(props.data.yesterdaySum).toFixed(2)).toLocaleString()}</Box>
                        </Tooltip>
                    </Typography>
                    <Typography variant="subtitle2" display="block">
                        <Tooltip title={+props.data.vssamedaylastweek} arrow>
                            <Box>${(parseFloat(props.data.vssamedaylastweek).toFixed(2)).toLocaleString()}</Box>
                        </Tooltip>
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
                        <Tooltip title={+props.data.sum7days} arrow>
                            <Box>${(parseFloat(props.data.sum7days).toFixed(2)).toLocaleString()}</Box>
                        </Tooltip>
                    </Typography>
                    <Typography variant="subtitle2" display="block">
                        <Tooltip title={+props.data.sumprev7days} arrow>
                            <Box>${(parseFloat(props.data.sumprev7days).toFixed(2)).toLocaleString()}</Box>
                        </Tooltip>
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
                        <Tooltip title={+props.data.sum30days} arrow>
                            <Box>${(parseFloat(props.data.sum30days).toFixed(2)).toLocaleString()}</Box>
                        </Tooltip>
                    </Typography>
                    <Typography variant="subtitle2" display="block">
                        <Tooltip title={+props.data.sumprev30days} arrow>
                            <Box>${(parseFloat(props.data.sumprev30days).toFixed(2)).toLocaleString()}</Box>
                        </Tooltip>
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
                        <Tooltip title={+props.balance} arrow>
                            <Box>${(parseFloat(props.balance).toFixed(2)).toLocaleString()}</Box>
                        </Tooltip>
                    </Typography>
                </div>

        </PaperBlockPrimary>);
}

export default Estimates;