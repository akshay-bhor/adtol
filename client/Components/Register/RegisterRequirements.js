import { Box, makeStyles } from "@material-ui/core";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
    link: {
      color: theme.palette.primary.main
    }
}));

const RegisterRequirements = () => {
    const muiStyles = useStyles();

    return (
      <Box components="div" style={{padding: "10px"}}>
        <h3>Publisher Requirement</h3>
        <b>You Must:</b>
        <ol>
        <li>Be 18+ or age of consent in your country.</li>
        <li>Not click your own ads or use any method to generate fake views/clicks.</li>
        </ol>
        <b>Your Website Must:</b>
        <ol>
        <li>Not contain any malware.</li>
        <li>Not be incomplete or under construction.</li>
        <li>Not contain any illegal content.</li>
        <li>Not contain excessive advertisement.</li>
        <li>Not contain links to illegal sites.</li>
        <li>Have been online and operational for atleast a month.</li>
        <li>Have minimum 200 unique visitors per day.</li>
        <li>Select adult, if you have nsfw content.</li>
        </ol>
        <p>For more info, read our <Link href="/publisher-guidelines"><a className={muiStyles.link}>Publisher Guidelines</a></Link>.</p>
        <h3>Advertiser Requirement</h3>
        <b>Your Website Must:</b>
        <ol>
        <li>Not contain any malware.</li>
        <li>Not contain any illegal content.</li>
        <li>Not link/redirect to any illegal website.</li>
        </ol>
        <p>For more info, read our <Link href="/advertiser-guidelines"><a className={muiStyles.link}>Advertiser Guidelines</a></Link>.</p>
      </Box>    
    );
}

export default RegisterRequirements;