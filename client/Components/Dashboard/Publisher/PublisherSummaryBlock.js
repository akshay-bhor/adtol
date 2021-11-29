import SummaryBlock from "../Common/SummaryBlock";

const PublisherSummaryBlock = (props) => { 

    let data = props.data;
    data = [
        {
            key: 1,
            title: 'Views',
            value: data.pub_views
        },
        {
            key: 2,
            title: 'Clicks',
            value: data.pub_clicks
        },
        {
            key: 3,
            title: 'Pops',
            value: data.pub_pops
        },
        {
            key: 4,
            title: 'Earning',
            value: data.pub_earning,
            prefix: '$',
            tooltip: true
        },
        {
            key: 5,
            title: 'Balance',
            value: data.pub_balance,
            prefix: '$',
            tooltip: true
        }
    ]

    return (
            <SummaryBlock data={data} heading={'Total'}></SummaryBlock>
        );
}

export default PublisherSummaryBlock;