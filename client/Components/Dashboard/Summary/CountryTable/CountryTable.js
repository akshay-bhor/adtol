import { Box } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid"
import { Fragment } from "react";
import PaperBlock from "../../Common/PaperBlock"
import styles from "../../Dashboard.module.css";

const CountryTable = (props) => {
    return (
        <Fragment>
            <PaperBlock heading={'Countries'} fullWidth={true}></PaperBlock>
            <Box className={styles.tableContainer}>
                <DataGrid 
                    autoHeight 
                    rows={props.rows} 
                    columns={props.columns}
                    style={{ minWidth: '1200px' }}
                ></DataGrid>
            </Box>
        </Fragment>
    );
}   

export default CountryTable;