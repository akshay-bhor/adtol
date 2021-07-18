import { Typography } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";

const Loading = (props) => {
  return (
    <div
      style={{
        marginTop: "100px",
        textAlign: "center",
      }}
    >
      <CircularProgress />
      <Typography component="h6">{props.msg ? props.msg:'Please Wait...'}</Typography>
    </div>
  );
};

export default Loading;
