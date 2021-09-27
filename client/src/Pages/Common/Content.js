import { Box, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    blockText: {
        textAlign: 'center',
        padding: '50px 10px 50px 10px'
    },
    heading: {
        fontSize: '30px',
        fontWeight: '600',
        color: theme.palette.primary.main,
        textShadow: `
            0.025em 0.025em 0 #66ffc2,
            0.05em 0.05em 0 #99c2ff,
            0.075em 0.075em 0 #ffc61a,
            0.1em 0.1em 0 #6666ff
        `,
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