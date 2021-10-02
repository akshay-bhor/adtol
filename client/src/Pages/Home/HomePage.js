import { Fragment } from 'react';
import Head from '../Common/Head';
import MidContent from './MidContent';
import advertiserImg from '../../assets/svg/advertiser.svg';
import publisherImg from '../../assets/svg/publisher.svg';
import referrelImg from '../../assets/svg/referrel.svg';
import growthImg from '../../assets/svg/growth.svg';
import Footer from '../../Components/UI/Footer/Footer';
import interconnected from '../../assets/svg/interconnected.svg';
import { Box, makeStyles, Typography } from '@material-ui/core';
import styles from "../Common/Content.module.css";
import PointList from '../Common/PointList';
import LayeredQuote from '../Common/LayeredQuote';
import { getAdQuote } from '../../util/common';

const useStyles = makeStyles(theme => ({
    quoteContainer: {
        marginTop: '15px',
        maxWidth: '800px',
        padding: '10px',
        color: theme.palette.primary.contrast,
        textAlign: 'center'
    },
    quote: {
        marginBottom: '20px',
        '&::before': {
            content: 'open-quote',
            fontSize: '36px'
        },
        '&::after': {
            content: "close-quote",
            fontSize: '36px'
        }
    },
    author: {
        fontStyle: 'italic',
        '&::before': {
            content: '\' — \'',
        }
    }
}));

/**
 * Metadata
 */

const heading = `An AdSense Alternative Ad Network`;

const subheading = `Get the best PPC ads for your website traffic. Our advanced
algorithm ensures highest possible revenue by rendering ads from
highest bidders for your website.`;

const adv = `Turn your visitor into paying customer! AdTol is industry leading multi-platform Ad Network with sophisticated algorithms and targeted ad-campaigns which guarantees to grab users attentions and boost the conversion rate.

AdTol offers most advanced cross channel advertising solutions with one of industry leading spam and fraudulent click protection that ensures high quality traffic with maximum conversion rate.`;

const pub = `Get the most out of your website and earn some extra cash with AdTol. Add value to your website with the most user-friendly ad formats available including Pop Ads, Text Ads and Banner Ads. Choose the Ad-Format of your choice and we will make sure that our ads will match the content and design of your site. With our sophisticated algorithm, your users will see highly targeted ads that guarantees high CTR and return extra revenue for you. Minimum payout amount is just $100 USD. Payments are made via Bank Transfer, PayPal, Payoneer and Bitcoin within 24 hours of payment request.`;

const ref = `Earn an extra set of cash with the best ad-network Affiliate program on the planet. Drive traffic from your website, app and earn commission on every qualified purchase referenced through you. Sign Up for our Affiliate program and earn 5% on all publisher's earnings and & 10% on all advertiser's spending from the users referred by you.

We offer world's most comprehensive and successful affiliate program which guarantees high commission on every purchase made by your customer.`;

const why = `All your advertising needs under one roof. Need to grow your business? Want More customers? Whatever your needs may be, we have got you covered! AdTol provides state-of-the-art result-driven advertising solutions that generate real user engagement and conversion for your business/brand. And with geo and behavioral targeting, we can take your advertising game to the next level. We work with the best in traffic quality.`;

const points = [
    {
        id: 1,
        icon: 'flash_on',
        heading: 'Fast Payments',
        text: 'Pay with integrated payment gateway with no barrier of currency'
    },
    {
        id: 2,
        icon: 'settings',
        heading: 'Unparalleled Service Quality',
        text: 'Our ad-experts always ready at your service 24/7.'
    },
    {
        id: 3,
        icon: 'dashboard',
        heading: 'Friendly Interface',
        text: 'Manage your ad-campaign from easy-to-use dashboard.'
    },
    {
        id: 4,
        icon: 'contact_support',
        heading: 'Dedicated Support',
        text: 'We ofer lightning fast support via E-Mail, Chat, and Skype.'
    },
    {
        id: 5,
        icon: 'public',
        heading: 'Worldwide Coverage',
        text: 'Easy-to-reach anywhere in the globe with 80% coverage of the web.'
    },
    {
        id: 6,
        icon: 'speed',
        heading: 'Performances',
        text: 'With highly targeted options, optimization is never been easier!'
    },
];

/**
 * END Metadata 
 */

const HomePage = () => {
    const muiStyles = useStyles();

    const adQuote = () => {
        const [quote, author] = getAdQuote();
        return (<Box component="div" className={muiStyles.quoteContainer}>
            <Typography variant="h5" component="h5" className={muiStyles.quote}>
                {quote}
            </Typography>
            <Typography variant="subtitle1" className={muiStyles.author}>{author}</Typography>
        </Box>);
    }
    
    return (
        <Fragment>
            <Head 
                heading={heading}
                subheading={subheading}
                headimg={interconnected}
            />
            <MidContent class='mid_container' heading='Advertiser' img={advertiserImg} link='/advertiser'>
                {adv}
            </MidContent>
            <MidContent class='mid_container' heading='Publisher' img={publisherImg} link='/publisher'>
                {pub}
            </MidContent>
            <MidContent class='mid_container' heading='Referral' img={referrelImg} link='/referrel'>
                {ref}
            </MidContent>
            <MidContent class='mid_container' 
                heading='WHY ADTOL?' 
                subheading="AdTol provides most intelligent cross-channel, multi-platform advertising solutions across the web."
                img={growthImg} 
                link='/register'
                btnText="Sign Up"
            >
                {why}
            </MidContent>
            <Box component="div">
                <h3 className={styles.content_heading}>Our Key Advantages</h3>
                <PointList points={points} />
            </Box>
            <LayeredQuote quote={adQuote()} />
            <Footer />
        </Fragment>
    )
}

export default HomePage;