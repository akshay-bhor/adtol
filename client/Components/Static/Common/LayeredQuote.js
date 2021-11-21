import { Box, makeStyles, Typography } from '@material-ui/core';
import LayeredBackground from '../../../public/assets/svg/layered-waves.svg';
import styles from "./Content.module.css";

const useStyles = makeStyles(theme => ({
    waveLayer: {
        width: '100%',
        height: '60vh',
        aspectRatio: '900/300',
        background: `url(${LayeredBackground.src}) no-repeat`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& .bottomHeading': {
            color: theme.palette.primary.contrast,
            fontSize: '32px',
            fontWeight: '700',
            padding: '10px',
            textAlign: 'center'
        }
    }
}));

const LayeredQuote = (props) => {
    const muiStyles = useStyles();

    return (
        <Box component="div" className={muiStyles.waveLayer}>
            {props.quote ? props.quote:<Typography component="h4" className="bottomHeading">MINIMISE EFFORTS, MAXIMIZE PROFITS</Typography>}
        </Box>
    );
}

export default LayeredQuote;