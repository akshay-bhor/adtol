import { makeStyles, Paper, Typography } from "@material-ui/core"
import styles from './common.module.css';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: '15px',
        borderRadius: '10px',
        margin: '15px 0',
        flexBasis: 'calc(50% - 10px)',
        ['@media(max-width:780px)']: {
            margin: '10px 0',
            flexBasis: 'calc(100% - 20px)'
        }
    },
    fullWidth: {
        margin: '15px 0',
        flexBasis: '100%',
        ['@media(max-width:780px)']: {
            margin: '10px 0',
            flexBasis: '100%'
        }
    }
}));

const PaperBlock = (props) => {
    const muiStyles = useStyles();

    return (
        <Paper elevation={2} className={[muiStyles.container, props.fullWidth ? muiStyles.fullWidth : ''].join(' ')}>
            {props.heading && <Typography variant="h5" component="h3" className={props.headingCenter ? "text-center":null}>{props.heading}</Typography>}
            {props.subheading && <Typography variant="subtitle2" display="block">{props.subheading}</Typography>}
            <div className={[styles.paperBlockContainer, props.heading ? 'mt-15':null].join(' ')}>
                {props.children}
            </div>
        </Paper>
    );
}

export default PaperBlock;