import { Typography } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";

const Loading = (props) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        marginTop: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CircularProgress />
      <Typography component="h6">{props.msg ? props.msg:'Please Wait...'}</Typography>
    </div>
  );
};

export default Loading;
