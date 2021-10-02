import { Fragment } from 'react';
import { Helmet } from "react-helmet";
import Head from '../Common/Head';
import advertiserImg from '../../assets/svg/advertise.svg';
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

const heading = `Advertisers`;

const subheading = `AdTol provides most comprehensive, cross-channel, multi-plateform, viable advertising solution on the web with years of experiance. All our tools runs most advance algorithms under the hood along with the power of machine learning that takes the ad targeting game to the next level.`;

const contentHeading = `FIRST TRULY REMARKABLE, INNOVATIVE, AND RELIABLE NATIVE AD PLATFORM`;

const contentText = () => (
<Fragment>
    <Box component="p">Our World is crowded place, the competition is fierce. Be it a business owner, trader, or manufacturer; advertising is crucial for everyone who wish to survive. A Bussiness without advertising is like setting a shop with state of the art furniture but there is no way others can see it. There is a saying in the world of advertising -</Box>
    <Box component="blockquote">The Man Who Stops Advertising To Save Money Is The Man Who Stops The Clock To Save Time.</Box>
    <Box component="p">Advertising is like storytelling, the only way people are gonna know about your existence is if you tell them. The competition here is - who can tell their story in most convincing manner, who can tell their story better and to how many people. The Internet is a new platform for advertisers where you can anyone and anywhere in the globe in a matter of seconds and fortunately, you are in the right place. We are the minds and makers of digital advertising business with years of experience in the competitive industry.
    Our system runs with most advance algorithm under the hood with advance targeting options which guarantees high user targeting to smallest level. With advance data, contextual, behaviour, and preference tracking, users only see the ads they are interested in. Combine that with our advanced auto optimization mechanism, the end result is improved CTR, and conversion rates. With advance fradulent click protection, you will never have to worry about spending your money on low-quality traffic.</Box>
</Fragment>
);

const points = [
    {
        id: 1,
        icon: 'location_on',
        heading: 'Targeted Ads',
        text: 'With advance targeting options like contextual, geo, behavioural, and preferencial targeting; Optimization has never been easier.'
    },
    {
        id: 2,
        icon: 'bar_chart',
        heading: 'High Conversion Rate',
        text: 'Our advance algorithms under the hood and ad optimization techniques ensures high conversion rates than any other advertising means.'
    },
    {
        id: 3,
        icon: 'dynamic_feed',
        heading: 'Multiple Ad Formats',
        text: 'Choose the ad format that best suits your site. Our ads will match with content of your site which gurantess high user engagement.'
    },
    {
        id: 4,
        icon: 'public',
        heading: 'Worldwide Coverage',
        text: 'With entire web within our reach, you can grab customers no matter where they are.'
    },
    {
        id: 5,
        icon: 'bolt',
        heading: 'Fast Payments',
        text: 'Add or withdraw you payments with ease. Pay with integrated secure payment gateway or other payments methods.'
    },
    {
        id: 6,
        icon: 'contact_support',
        heading: 'Dedicated Support',
        text: 'Get lightning fast 24/7 support via email, chat, and skype.'
    },
];

/**
 * END Metadata 
 */

const AdvertiserPage = () => {
    const muiStyles = useStyles();

    return (
        <Fragment>
            <Helmet>
                <title>Best AdWords Alternative Ad Network For Advertisers - AdTol</title>
            </Helmet>
            <Head 
                heading={heading}
                subheading={subheading}
                headimg={advertiserImg}
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

export default AdvertiserPage;