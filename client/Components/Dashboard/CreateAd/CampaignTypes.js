import { Box, Icon, makeStyles, Typography } from "@material-ui/core";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { fetchCampaignTypes } from "../../../store/actions/campaigns.action";
import Loading from "../../UI/Loading";
import ShowError from "../../UI/ShowError";
import PaperBlock from "../Common/PaperBlock";
import styles from "../Dashboard.module.css";

const useStyles = makeStyles((theme) => ({
  campaignCardContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: "100%",
  },
  campaignCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "240px",
    padding: "10px",
    height: "240px",
    marginTop: "20px",
    border: "2px solid #ccc",
    borderRadius: "10px",
    cursor: "pointer",
    color: theme.palette.primary.main,
    overflow: 'hidden'
  },
}));

const CampaignTypes = () => {
  const muiStyles = useStyles();
  const loading = useSelector((state) => state.campaign.loading);
  const campaignTypes = useSelector((state) => state.campaign.campaign_types);
  const err = useSelector((state) => state.campaign.error);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCampaignTypes());
  }, []);

  return (
    <Fragment>
      {loading && !err && (
        <div className={styles.loader}>
          <Loading />
        </div>
      )}
      {!loading && !err && (
        <PaperBlock heading="Choose Your Goal" fullWidth="true">
          <Box component="div" className={muiStyles.campaignCardContainer}>
            {campaignTypes.map((item, idx) => (
              <Link href={`/dashboard/create-ad/campaign?goal=${item.id}`} key={idx}>
                <a className={muiStyles.campaignCard}>
                  <Icon>{item.icon}</Icon>
                  <Typography
                    component="h3"
                    variant="h6"
                    className="text-center mt-10"
                  >
                    {item.type}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    className="text-center subtitle"
                  >
                    {item.desc}
                  </Typography>
                </a>
              </Link>
            ))}
          </Box>
        </PaperBlock>
      )}
      {err && <ShowError />}
    </Fragment>
  );
};

export default CampaignTypes;
