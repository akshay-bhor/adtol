import { Box, Button, Icon, makeStyles, Typography } from "@material-ui/core";
import { Fragment, memo, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaignBanners } from "../../../store/actions/campaigns.action";
import FullScreenModal from "../../UI/FullScreenModal";
import Loading from "../../UI/Loading";
import UploadBannersModal from "./UploadBannersModal";

const useStyles = makeStyles((theme) => ({
    title: {
        margin: '10px 5px',
        display: 'inline-block'
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
        boxSizing: 'border-box'
    },
    img: {
        margin: '0 auto',
        maxWidth: '100%',
        maxHeight: '100%',
        cursor: 'pointer',
    },
    imgChoosen: {
        filter: 'grayscale(80%)'
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
  const [choosenBanners, setChoosenBanners] = useState(props.banners);
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const muiStyles = useStyles();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = () => {
    // fetch Banners
    dispatch(fetchCampaignBanners());
  }

  const modalToggle = () => {
      setModalOpen(prev => !prev);
  }

  const addChoosenBanner = (id) => {
      const set = new Set(choosenBanners);
      set.add(id);
      const arr = Array.from(set);
      setChoosenBanners(arr);
  }

  const removeChoosenBanner = (id) => {
      const newArr = choosenBanners.filter(bid => bid !== id);
      setChoosenBanners(newArr);
  } 

  const onSave = () => {
    props.onSave(choosenBanners);
  }

  const onClose = () => {
    props.onClose();
  }

  return (
    <Fragment>
        <FullScreenModal
        title={"Banners"}
        onClose={onClose}
        onSave={onSave}
        >
            <Box component="div">
                <Typography variant="h6" className={muiStyles.title}>
                    Choosen Banners
                </Typography>
                <Typography variant="subtitle2" className={`${muiStyles.title} subtitle`}>(Click to remove)</Typography>
                {loading && <div className={muiStyles.hScroller}><Loading /></div>}
                {!loading && (<div className={muiStyles.hScroller}>
                    {banners.filter(banner => choosenBanners.includes(banner.id)).map((banner, idx) => {
                        return (
                            <div className={muiStyles.imgContainer} key={idx}>
                                <div className={muiStyles.innerContainer} key={idx}>
                                    <img src={banner.src} alt={'banner-'+banner.size} 
                                        onClick={() => removeChoosenBanner(banner.id)}
                                        className={muiStyles.img} 
                                    />
                                    <span component="span" className={muiStyles.imgLabel}>{banner.size}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>)}
                <Box component="div">
                    <Typography variant="h6" className={muiStyles.title}>
                        Uploaded Banners
                    </Typography>
                    <Typography variant="subtitle2" className={`${muiStyles.title} subtitle`}>(Click to add)</Typography>
                    <Button 
                        color="primary" 
                        size="small"
                        startIcon={<Icon>refresh</Icon>}
                        className="fright"
                        onClick={fetchBanners}
                    >
                        Refresh
                    </Button>
                    <Button 
                        color="primary" 
                        size="small"
                        startIcon={<Icon>upload</Icon>}
                        className="mr-10 fright"
                        onClick={modalToggle}
                    >
                        Upload Banners
                    </Button>
                </Box>
                {loading && <div className={muiStyles.hScroller}><Loading /></div>}
                {!loading && banners.length > 0 && (<div className={muiStyles.hScroller}>
                    {banners.map((banner, idx) => {
                        return (
                            <div className={muiStyles.imgContainer} key={idx}>
                                <div className={muiStyles.innerContainer} key={idx}>
                                    <img src={banner.src} alt={'banner-'+banner.size} 
                                        onClick={() => addChoosenBanner(banner.id)}
                                        className={[muiStyles.img, choosenBanners.includes(banner.id) ? muiStyles.imgChoosen:null].join(' ')} 
                                    />
                                    <span component="span" className={muiStyles.imgLabel}>{banner.size}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>)}
                {!loading && banners.length === 0 && (
                    <div className={muiStyles.hScroller}>No Banners found, upload banners and hit refresh!</div>
                )}
            </Box>
        </FullScreenModal>
        {modalOpen ? <UploadBannersModal onClose={modalToggle} />:null}
    </Fragment>
  );
};

export default memo(BannersListModal);
