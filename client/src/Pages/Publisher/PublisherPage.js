import { Fragment } from 'react';
import Head from '../Common/Head';
import publisherImg from '../../assets/svg/publish.svg';
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

const heading = `Publishers`;

const subheading = `Earn an extra set of cash by doing what you do best. AdTol provides industry leading most reliable ad solutions on the web. Choose from our variety of ad-formats and we make sure our ads match the content of your site. Our advance algorithms ensures highly targeted ads that guarantees to add an extra dollor to your earnings.`;

const contentHeading = `BEST CROSS-CHANNEL, MULTI-PLATEFORM AD NETWORK`;

const contentText = () => (
<Fragment>
    <Box component="p">Get the best out of your website and earn the money you deserve for each hour you spend in growing your site. Take your earnings to next level and add value to website with the most user-friendly ad formats available on the web. We provide most comprehensive and reliable ad solutions on the web. Select the ad format of your choice and we make sure that it will match the content as well as design of your site. With our advanced and sophisticated algorithm, your users will see highly targeted ads that ensures real user engagement and high CTR resulting in extra set of revenue for you. AdTol Provides state-of-the-art data driven advertising solution that genrates higher CTR and conversion rates, combine that with contextual, geo, behavioural, and preferencial targeting, we can take your advertising game to next level and reward you with high amount CPC, PPC, and eCPM rates. Our compelling ad formats and targeted ad campaigns integrated with auto optimization and real-time bidding are proven to grab users attention, we only show highest bidding ads on your site to keep your ad performance at peak level.</Box>
</Fragment>
);

const points = [
    {
        id: 1,
        icon: 'location_on',
        heading: 'Targeted Ads',
        text: 'With highly targeting options, our system ensures high CTR and eCPM rates that adds an extra dollor to your earnings.'
    },
    {
        id: 2,
        icon: 'bar_chart',
        heading: 'High CTR',
        text: 'With contextual, geo, and behavioural targeting, our advance algorithms ensures that the users only sees the ads they are interested in, which guarantess high CTR.'
    },
    {
        id: 3,
        icon: 'dynamic_feed',
        heading: 'Multiple Ad Formats',
        text: 'Choose from variety of ad formats that best suits your site and customers and our system will ensure that it will match the content of your site.'
    },
    {
        id: 4,
        icon: 'space_dashboard',
        heading: 'Friendly Interface',
        text: 'Track and monitor your progress, manage your campaigns with easy to use dashboard.'
    },
    {
        id: 5,
        icon: 'thumb_up',
        heading: '100% Fill Rate',
        text: 'With thousands of adverisers and advance algorithms, we always have ads in your niche.'
    },
    {
        id: 6,
        icon: 'contact_support',
        heading: 'Support',
        text: 'Get lightning fast 24/7 support via email, chat, and skype.'
    },
];

/**
 * END Metadata 
 */

const PublisherPage = () => {
    const muiStyles = useStyles();

    return (
        <Fragment>
            <Head 
                heading={heading}
                subheading={subheading}
                headimg={publisherImg}
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

export default PublisherPage;