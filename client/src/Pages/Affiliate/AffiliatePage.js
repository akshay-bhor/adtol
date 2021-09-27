import { Fragment } from 'react';
import Head from '../Common/Head';
import affiliateImg from '../../assets/svg/share.svg';
import Footer from '../../Components/UI/Footer/Footer';
import { Box, Button, makeStyles } from '@material-ui/core';
import PointList from '../Common/PointList';
import { Link } from 'react-router-dom';
import Content from '../Common/Content';
import LayeredQuote from '../Common/LayeredQuote';

const useStyles = makeStyles({
    btnContainer: {
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '50px',
    },
});

/**
 * Metadata
 */

const heading = `Affiliate Program`;

const subheading = `Earn an Extra Set of Cash With World's Most Sophisticated Affiliate Program.`;

const contentHeading = `INNOVATIVE, RELIABLE, & MOST SUCCESSFUL AD-NETWORK AFFILIATE PROGRAM IN INDIA.`;

const contentText = () => (
<Fragment>
    <Box component="p">Who doesn't want to make an extra dollor per amount of work they spend in? Money is important and crucial in today's world, but it is becoming harder and harder to earn it. So, here we are! Presenting world's most reliable affiliate program. Wheather you are a website owner, blogger, youtuber, or any kind of Internet wiz who wish to make some money using your online skills, affiliate marketing is the best and most suited option for you. AdTol provides world's most sophisticated & successful affiliate ad-network program. Become our Affiliate partner and add an extra dollor to your earnings on each qualified purchase referenced through you. Get up and join now! It's Free! Just sign Up for our Affiliate program and get verified in only one approval and start earning instantly. Choose from our wide range of products that best suits your customers. Our advanced tools let's you add and setup your campaign within seconds and help you monetize your website. Earn upto 10% commissions on every qualified purchase, plus our advaned tools and actionable analytics ensures high conversion rates that helps you maximise your earnings.</Box>
</Fragment>
);

const points = [
    {
        id: 1,
        icon: 'person',
        heading: 'Join',
        text: 'Join free within only few simple steps and start earning instantly. Join and start running your campaign today with only one approval.'
    },
    {
        id: 2,
        icon: 'campaign',
        heading: 'Promote',
        text: 'Choose from wide range of services that best suits your customers and advertise them in any means youn want. Wheather you own a website or not, advertise in any means you want and you will get commission on every qualified referal purchase.'
    },
    {
        id: 3,
        icon: 'savings',
        heading: 'Earn',
        text: 'Earn upto 10% commission on every qualified purchase referenced through you, not just the products you advertised. Maximise your earnings with our sophisticated algorithms and actionable analytics that ensures high CTR and Conversion rates.'
    },
];

/**
 * END Metadata 
 */

const AffiliatePage = () => {
    const muiStyles = useStyles();

    return (
        <Fragment>
            <Head 
                heading={heading}
                subheading={subheading}
                headimg={affiliateImg}
            />
            <Box component="div">
                <PointList points={points} />
                <Box component="div" className={muiStyles.btnContainer}>
                    <Button 
                        to="/register"
                        component={Link}
                        color="primary"
                        size="large"
                        variant="contained"
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>
            <Content heading={contentHeading} text={contentText()} />
            <Box component="div" className={muiStyles.btnContainer}>
                <Button 
                    to="/register"
                    component={Link}
                    color="primary"
                    size="large"
                    variant="contained"
                >
                    Sign Up
                </Button>
            </Box>
            <LayeredQuote />
            <Footer />
        </Fragment>
    )
}

export default AffiliatePage;