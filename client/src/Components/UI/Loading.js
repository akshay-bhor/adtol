import { CircularProgress } from "@material-ui/core";

const Loading = () => {
  return (
    <div
      style={{
        marginTop: "100px",
        textAlign: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default Loading;
