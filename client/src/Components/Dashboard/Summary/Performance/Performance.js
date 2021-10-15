import { Typography, Grid } from "@material-ui/core"
import {makeFriendly} from '../../../../util/common';
import PaperBlock from "../../Common/PaperBlock";

const Performance = (props) => {

    return (
        <PaperBlock heading="Performance" subheading="Today">
            <Grid container spacing={4}>
                <Grid item xs={6} md={6} lg={3}>
                    <Typography variant="subtitle2" color="textSecondary" display="block">
                        Impressions
                    </Typography>
                    <Typography variant="h4" display="block">
                        {makeFriendly(props.data.impressions)}
                    </Typography>
                </Grid>

                <Grid item xs={6} md={6} lg={3}>
                    <Typography variant="subtitle2" color="textSecondary" display="block">
                        Pops
                    </Typography>
                    <Typography variant="h4" display="block">
                        {makeFriendly(props.data.pops)}
                    </Typography>
                </Grid>

                <Grid item xs={6} md={6} lg={3}>
                    <Typography variant="subtitle2" color="textSecondary" display="block">
                        Clicks
                    </Typography>
                    <Typography variant="h4" display="block">
                        {makeFriendly(props.data.clicks)}
                    </Typography>
                </Grid>

                <Grid item xs={6} md={6} lg={3}>
                    <Typography variant="subtitle2" color="textSecondary" display="block">
                        CPC
                    </Typography>
                    <Typography variant="h4" display="block">
                        {!isNaN(props.data.cpc) ? '$'+(+props.data.cpc).toLocaleString() : props.data.cpc }
                    </Typography>
                </Grid>
            </Grid>
        </PaperBlock>
    );
}

export default Performance;