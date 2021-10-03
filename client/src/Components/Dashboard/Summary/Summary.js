import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import Loading from "../../UI/Loading";
import PlatformChart from "./PlatformChart/PlatformChart";
import Estimates from "./Estimates/Estimates"
import Performance from "./Performance/Performance";
import styles from '../Dashboard.module.css';
import { abortSummaryRequest, fetchSummaryData, fetchUserStatus } from "../../../store/actions/summary.action";
import CountryTable from "./CountryTable/CountryTable";
import { countryColumnsAd, countryColumnsPub } from "../../../constants/common";
import { Button } from "@material-ui/core";
import ShowError from "../../UI/ShowError";
import UserStatusNotification from "./UserStatusNotification/UserStatusNotification";

const classes = {
    btnContainer: {
        display: 'flex',
        marginBottom: '10px',
        flex: '1',
        justifyContent: 'flex-end'
    }
}

const mapRows = (colName, propData) => {
    let data = colName === 'Earned' ? propData.pub_countries:propData.ad_countries;
    
    const rows = Object.keys(data).map((key, index) => {
        let earned, spent;
        const id = index;
        if(colName === 'Earned')
            earned = '$'+data[key].earned;
        else
            spent = '$'+data[key].spent;
        const views = +data[key].views;
        const clicks = +data[key].clicks;
        const pops = +data[key].pops;
        const country = key;
        let ctr = data[key].ctr ? data[key].ctr + "%" : "NA";

        // Calculate CTR
        if(ctr === 'NA') {
            if(clicks !== 0) {
            ctr = (clicks / views).toFixed(2) + "%";
            }
        }

        if(colName === 'Earned')
            return {
                id, country, earned, views, clicks, pops, ctr
            }  
        else
            return {
                id, country, spent, views, clicks, pops, ctr
            }    
    });

    return rows;
}

const Summary = () => {
    const isLoading = useSelector((state) => state.summary.loading);
    const data = useSelector((state) => state.summary.data);
    const userStatus = useSelector((state) => state.summary.userStatus);
    const err = useSelector((state) => state.summary.error);
    const [selected, setSelected] = useState(1);
    const dispatch = useDispatch();
    let pubRows = [];
    let adRows = [];

    useEffect(() => {
        dispatch(fetchSummaryData());

        // Check weather to check for status
        const hideNotification = localStorage.getItem('hideUserStatusNotification');
        if(!hideNotification) dispatch(fetchUserStatus());

        return () => {
            abortSummaryRequest();
        }
    }, [dispatch]);

    if(data && !isLoading && !err) {
        pubRows = mapRows('Earned', data);
        adRows = mapRows('Spent', data);
    }

    return (
        <Fragment>
            <Helmet>
                <title>Dashboard - AdTol</title>
            </Helmet>
            {isLoading && !err && <div className={styles.loader}><Loading /></div>}
            {!isLoading && !err && data &&
                <Fragment>
                    <div style={classes.btnContainer}>
                        <Button 
                            color={selected === 1 ? 'primary':'default'}
                            className={'fright pointer'} 
                            onClick={() => setSelected(1) }>
                                Advertiser
                        </Button>
                        <Button 
                            color={selected === 2 ? 'primary':'default'}
                            className={'fright pointer'} 
                            onClick={() => setSelected(2) }>
                                Publisher
                        </Button>
                    </div>
        
                    {selected === 1 && <Fragment>
                    <Estimates data={data.ad_estimates} balance={data.ad_balance} selected={selected} />
                    <Performance data={data.ad_performance} />
                    <PlatformChart data={data.ad_ad_devices} />
                    <CountryTable data={data.ad_countries} rows={adRows} columns={countryColumnsAd()} /></Fragment>}
                    
                    {selected === 2 && <Fragment>
                    <Estimates data={data.pub_estimates} balance={data.pub_balance} />
                    <Performance data={data.pub_performance} />
                    <PlatformChart data={data.pub_ad_devices} />
                    <CountryTable data={data.pub_countries} rows={pubRows} columns={countryColumnsPub()} /></Fragment>}

                </Fragment>}
                {!isLoading && !err && userStatus && <UserStatusNotification />}
                {err && <ShowError />}
        </Fragment>
    );
}

export default Summary;