import SummaryBlock from "../Common/SummaryBlock";

const AdvertiserSummaryBlock = (props) => { 

    let data = props.data;
    data = [
        {
            key: 1,
            title: 'Views',
            value: data.ad_views
        },
        {
            key: 2,
            title: 'Clicks',
            value: data.ad_clicks
        },
        {
            key: 3,
            title: 'Pops',
            value: data.ad_pops
        },
        {
            key: 4,
            title: 'Spending',
            value: data.ad_spending,
            prefix: '$'
        },
        {
            key: 5,
            title: 'Balance',
            value: data.ad_balance,
            prefix: '$'
        }
    ]

    return (
            <SummaryBlock data={data} heading={'Total'}></SummaryBlock>
        );
}

export default AdvertiserSummaryBlock;