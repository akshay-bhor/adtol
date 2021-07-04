import { Fragment } from 'react';
import Head from './Head';
import MidContent from './MidContent';
import Bottom from './Bottom';
import advertiserImg from '../../assets/svg/advertiser.svg';
import publisherImg from '../../assets/svg/publisher.svg';
import referrelImg from '../../assets/svg/referrel.svg';
import Footer from '../UI/Footer/Footer';

const adv = `Turn your visitor into paying customer! AdTol is industry leading multi-platform Ad Network with sophisticated algorithms and targeted ad-campaigns which guarantees to grab users attentions and boost the conversion rate.

AdTol offers most advanced cross channel advertising solutions with one of industry leading spam and fraudulent click protection that ensures high quality traffic with maximum conversion rate.`;

const pub = `Get the most out of your website and earn some extra cash with AdTol. Add value to your website with the most user-friendly ad formats available including Pop Ads, Text Ads and Banner Ads. Choose the Ad-Format of your choice and we will make sure that our ads will match the content and design of your site. With our sophisticated algorithm, your users will see highly targeted ads that guarantees high CTR and return extra revenue for you. Minimum payout amount is just $100 USD. Payments are made via Bank Transfer, PayPal, Payoneer and Bitcoin within 24 hours of payment request.`;

const ref = `Earn an extra set of cash with the best ad-network Affiliate program on the planet. Drive traffic from your website, app and earn commission on every qualified purchase referenced through you. Sign Up for our Affiliate program and earn 5% on all publisher's earnings and & 10% on all advertiser's spending from the users referred by you.

We offer world's most comprehensive and successful affiliate program which guarantees high commission on every purchase made by your customer.`;

const Home = (props) => {
    return (
        <Fragment>
            <Head></Head>
            <MidContent class='mid_container' heading='Advertiser' img={advertiserImg} link='/advertiser'>
                {adv}
            </MidContent>
            <MidContent class='mid_container' heading='Publisher' img={publisherImg} link='/publisher'>
                {pub}
            </MidContent>
            <MidContent class='mid_container' heading='Referrel' img={referrelImg} link='/referrel'>
                {ref}
            </MidContent>
            <Bottom />
            <Footer />
        </Fragment>
    )
}

export default Home;