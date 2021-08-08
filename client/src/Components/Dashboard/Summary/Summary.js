import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../UI/Loading";
import AdUnits from "./AdUnits/AdUnits";
import Estimates from "./Estimates/Estimates"
import Performance from "./Performance/Performance";
import styles from '../Dashboard.module.css';
import { abortSummaryRequest, fetchSummaryData } from "../../../store/actions/summary.action";
import CountryTable from "./CountryTable/CountryTable";
import { summaryCountryColumnsAd, summaryCountryColumnsPub } from "../../../constants/common";
import classes from './Summary.module.css';
import { Button } from "@material-ui/core";
import ShowError from "../../UI/ShowError";

const mapRows = (colName, propData) => {
    let data = colName === 'Earned' ? propData.pub_countries:propData.ad_countries;
    
    const rows = Object.keys(data).map(key => {
        let earned, spent;
        const id = ''+Math.random();
        if(colName === 'Earned')
            earned = '$'+data[key].earned;
        else
            spent = '$'+data[key].spent;
        const views = data[key].views;
        const clicks = data[key].clicks;
        const pops = data[key].pops;
        const country = key;

        if(colName === 'Earned')
            return {
                id, country, earned, views, clicks, pops
            }  
        else
            return {
                id, country, spent, views, clicks, pops
            }    
    });

    return rows;
}

const Summary = () => {
    const isLoading = useSelector((state) => state.summary.loading);
    const data = useSelector((state) => state.summary.data);
    const err = useSelector((state) => state.summary.error);
    const [selected, setSelected] = useState(1);
    const dispatch = useDispatch();
    let pubRows = [];
    let adRows = [];

    useEffect(() => {
        dispatch(fetchSummaryData());

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
            {isLoading && !err && <div className={styles.loader}><Loading /></div>}
            {!isLoading && !err && 
                <Fragment>
                    <div className={classes.btnContainer}>
                        <Button color="primary" className={'fright pointer'} onClick={
                            () => {
                                setSelected(s => s == 1 ? 2 : 1);
                            }
                        }>{selected == 1 ? 'Advertiser':'Publisher'}</Button>
                    </div>
                    {selected === 1 && <Fragment>
                    <Estimates data={data.pub_estimates} balance={data.pub_balance} />
                    <Performance data={data.pub_performance} />
                    <AdUnits data={data.pub_ad_units} />
                    <CountryTable data={data.pub_countries} rows={pubRows} columns={summaryCountryColumnsPub} /></Fragment>}

                    {selected !== 1 && <Fragment>
                    <Estimates data={data.ad_estimates} balance={data.ad_balance} />
                    <Performance data={data.ad_performance} />
                    <AdUnits data={data.ad_ad_units} />
                    <CountryTable data={data.ad_countries} rows={adRows} columns={summaryCountryColumnsAd} /></Fragment>}
                
                </Fragment>}
                {err && <ShowError />}
        </Fragment>
    );
}

export default Summary;