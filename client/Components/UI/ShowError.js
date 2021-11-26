import { Typography } from "@material-ui/core";
import errImg from "../../public/assets/svg/warning.svg";

const errMsgContainer = {
  width: "100%",
  overflow: "hidden",
  height: "80vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const errMsg = {
  color: "#999",
  margin: "30px auto",
  maxWidth: "800px",
};

const ShowError = () => {
  return (
    <div style={errMsgContainer}>
      <img
        src={errImg.src}
        style={{ maxWidth: "40%", display: "block" }}
        alt="Error"
      />
      <div className="text-center">
        <Typography variant="h5" style={errMsg}>
          Oops! Unknown Error Occured, please try refreshing page after some
          time!
        </Typography>
      </div>
    </div>
  );
};

export default ShowError;
