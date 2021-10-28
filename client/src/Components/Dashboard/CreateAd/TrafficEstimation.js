import { Box, Typography } from "@material-ui/core";
import { memo, useEffect, useState } from "react";
import { uiActions } from "../../../store/reducers/ui.reducer";
import Loading from "../../UI/Loading";
import Modal from "../../UI/Modal";
import { getTrafficEstimation } from "../../../services/apiService";

const TrafficEstimation = (props) => {
    const [loading, setLoading] = useState(false);
    const [estimates, setEstimates] = useState();
  
    useEffect(() => {

        const fetchEstimates = async () => {
            // Fetch Estimates
            setLoading(true);
            try {
                const postData = {
                    category: props.categories.join(','),
                    country: props.countries.join(','),
                    device:  props.devices.join(','),
                    os: props.os.join(','),
                    browser: props.browsers.join(','),
                    language: props.languages.join(','),
                    adult: props.adult || 0,
                    campaign_type: props.campType
                }

                const res = await getTrafficEstimation(postData);
                setEstimates(res.data);

                setLoading(false);
            } catch (err) {
                setLoading(false);
                uiActions.showAlert('Error', 'Something Went Wrong, Try Again!');
            }
        }

        fetchEstimates();
    }, []);
    
    return (
        <Modal title={'Traffic Estimation'} onClose={props.onClose}>
            {loading ? <Loading />:null}
            {!loading && estimates && (
                <Box component="div">
                    {props.type == 'campaign' ? 
                        <Box component="div">
                            <Box component="div" className="mt-10">
                                <Typography variant="subtitle1">We estimate you'll receive 
                                <span className="bold"> {estimates.campaign.impressions}</span> impressions per day</Typography>
                            </Box>
                            <Box component="div" className="mt-10">
                                <Typography variant="subtitle1">Highest bid for your targeting options is
                                <span className="bold"> ${estimates.campaign.max_cpc}</span></Typography>
                            </Box>
                            <Box component="div" className="mt-10">
                                <Typography variant="subtitle1">Average bid for your targeting options is
                                <span className="bold"> ${estimates.campaign.avg_cpc}</span></Typography>
                            </Box>
                            <Box component="div" className="mt-10">
                                <Typography variant="subtitle1">We estimate you will receive clicks between 
                                <span className="bold"> {estimates.campaign.min_clicks} - {estimates.campaign.max_clicks}</span></Typography>
                            </Box>
                        </Box>:null}

                        {props.type == 'pop' ? 
                        <Box component="div">
                            <Box component="div" className="mt-10">
                                <Typography variant="subtitle1">We estimate you'll receive 
                                <span className="bold"> {estimates.pop.pops}</span> impressions per day</Typography>
                            </Box>
                            <Box component="div" className="mt-10">
                                <Typography variant="subtitle1">Highest bid for your targeting options is
                                <span className="bold"> ${estimates.pop.max_cpc}</span></Typography>
                            </Box>
                            <Box component="div" className="mt-10">
                                <Typography variant="subtitle1">Average bid for your targeting options is
                                <span className="bold"> ${estimates.pop.avg_cpc}</span></Typography>
                            </Box>
                        </Box>:null}
                </Box>
            )}
        </Modal>
    );
}

export default memo(TrafficEstimation);