import { Box, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    blockText: {
        textAlign: 'center',
        padding: '50px 10px 50px 10px'
    },
    heading: {
        fontSize: '30px',
        fontWeight: '600',
        color: 'transparent',
        backgroundImage: 'linear-gradient(to right, #0000ff, #531f8b)',
        '-webkit-background-clip': 'text',
        '-moz-background-clip': 'text',
        backgroundClip: 'text'
    }
}));

const Content = (props) => {
    const muiStyles = useStyles();

    return (
        <Box component="div" className={muiStyles.blockText}>
            <Typography component="h2" className={muiStyles.heading}>
                {props.heading}
            </Typography>
            <Typography variant="subtitle1">{props.text}</Typography>
        </Box>
    );
}

export default Content;