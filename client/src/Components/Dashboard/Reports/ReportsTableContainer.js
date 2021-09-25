import { Grid } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import {
  browserColumnsAd,
  browserColumnsPub,
  campaignCols,
  countryColumnsAd,
  countryColumnsPub,
  dateColumnsAd,
  dateColumnsPub,
  deviceColumnsAd,
  deviceColumnsPub,
  osColumnsAd,
  osColumnsPub,
  websitesCols,
} from "../../../constants/common";

const mapRows = (data, path, colName) => {
  if (typeof data !== "object") return [];
  let res = Object.keys(data).map((key) => {
    const returnObj = {
      id: key,
      views: data[key].views,
      clicks: data[key].clicks,
      pops: data[key].pops,
      spent: "$" + parseFloat(data[key].cost).toFixed(2),
      ctr: data[key].ctr ? data[key].ctr + "%" : "NA",
    };
    
    // Dynamic key
    if(colName === 'campaign') returnObj[colName] = data[key].title;
    else if(colName === 'website') returnObj[colName] = data[key].domain; 
    else returnObj[colName] = key;

    // Calculate CTR
    if (returnObj.ctr === "NA") {
      if (+returnObj.clicks !== 0) {
        returnObj.ctr = (returnObj.views / returnObj.clicks).toFixed(2) + '%';
      }
    }

    if (path === "publisher") {
      delete returnObj.spent;
      returnObj.earned = "$" + parseFloat(data[key].cost).toFixed(2);
    }
    return returnObj;
  });
  return res;
};

/** API Keys for mapping */
const paramsList = [
  { key: 1, name: "views_clicks", col: "date" },
  { key: 2, name: "by_country", col: "country" },
  { key: 3, name: "by_device", col: "device" },
  { key: 4, name: "by_os", col: "os" },
  { key: 5, name: "by_browser", col: "browser" },
  { key: 6, name: "by_elements", col: "na" },
];

const ReportsTableContainer = (props) => {
  let [{ name: param, col: colName }] = paramsList.filter(
    (item) => item.key === props.breakdown
  );

  const getCols = () => {
    if (props.breakdown === 1)
      return props.path === "advertiser" ? dateColumnsAd() : dateColumnsPub();

    if (props.breakdown === 2)
      return props.path === "advertiser"
        ? countryColumnsAd()
        : countryColumnsPub();

    if (props.breakdown === 3)
      return props.path === "advertiser"
        ? deviceColumnsAd()
        : deviceColumnsPub();

    if (props.breakdown === 4)
      return props.path === "advertiser" ? osColumnsAd() : osColumnsPub();

    if (props.breakdown === 5)
      return props.path === "advertiser"
        ? browserColumnsAd()
        : browserColumnsPub();

    if (props.breakdown === 6)
      return props.path === "advertiser" ? campaignCols() : websitesCols();
  };

  if (colName === "na") {
    if (props.path === "advertiser") colName = "campaign";
    if (props.path === "publisher") colName = "website";
  }

  return (
    <Grid item xs={12} className={props.class}>
        <DataGrid
          autoHeight
          columns={getCols()}
          rows={mapRows(
            props.path === "advertiser"
              ? props.advertiserData[param]
              : props.publisherData[param],
            props.path,
            colName
          )}
        />
    </Grid>
  );
};

export default ReportsTableContainer;
