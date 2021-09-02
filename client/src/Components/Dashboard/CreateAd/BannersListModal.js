import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import { Fragment } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaignBanners } from "../../../store/actions/campaigns.action";
import FullScreenModal from "../../UI/FullScreenModal";
import Loading from "../../UI/Loading";

const useStyles = makeStyles((theme) => ({
    title: {
        margin: '10px 5px'
    },
    hScroller: {
        overflowX: 'scroll',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
        height: '35vh'
    },
    imgContainer: {
        display: 'inline-block',
        overflow: 'hidden',
        height: '100%',
        maxWidth: '500px',
        marginRight: '15px'
    },
    innerContainer: {
        display: 'flex',
        width: 'auto',
        height: '100%',
        alignItems: 'flex-end',
        position: 'relative',
    },
    img: {
        margin: '0 auto',
        width: 'auto',
        maxHeight: '100%'
    },
    imgLabel: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        background: 'rgba(0,0,0,0.4)',
        color: '#fff',
        padding: '2px 4px',
        borderRadius: '4px'
    }
}));

const BannersListModal = (props) => {
  const loading = useSelector((state) => state.campaign.loading);
  const banners = useSelector((state) => state.campaign.banners);
  const dispatch = useDispatch();
  const muiStyles = useStyles();

  useEffect(() => {
    // fetch Banners
    dispatch(fetchCampaignBanners());
  }, []);

  return (
    <FullScreenModal
      title={"Banners"}
      onClose={props.onClose}
    >
      {loading && <Loading />}
      {!loading && (
            <Box component="div">
                <Typography variant="h6" className={muiStyles.title}>
                    Choosen Banners
                </Typography>
                <div className={muiStyles.hScroller}>
                    {banners.map((banner, idx) => {
                        return (
                            <div className={muiStyles.imgContainer} key={idx}>
                                <div className={muiStyles.innerContainer} key={idx}>
                                    <img src={banner.src} alt={'banner-'+banner.size} className={muiStyles.img} />
                                    <span component="span" className={muiStyles.imgLabel}>{banner.size}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Box>
      )}
    </FullScreenModal>
  );
};

export default BannersListModal;
