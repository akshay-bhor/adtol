import { Typography } from "@material-ui/core";
import styles from "./common.module.css";
import PaperBlockPrimary from "./PaperBlockPrimary";

const SummaryBlock = (props) => {

  return (
      <PaperBlockPrimary heading={props.heading}>
      <div className={styles.container}>
        {props.data.map((item) => {
          return (
            <div className={styles.iblock} key={item.key}>
              <Typography variant="caption" display="block">
                {item.title}
              </Typography>
              <Typography variant="h4" display="block">
                {item.prefix}{(+item.value).toLocaleString()}
              </Typography>
            </div>
          )
        })}
      </div>
    </PaperBlockPrimary>
  );
}

export default SummaryBlock;
