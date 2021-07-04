import { DataGrid } from "@material-ui/data-grid"
import PaperBlock from "../../Common/PaperBlock"

const CountryTable = (props) => {
    return (
        <PaperBlock heading={'Countries'} fullWidth={true}>
            <DataGrid autoHeight rows={props.rows} columns={props.columns}></DataGrid>
        </PaperBlock>
    );
}   

export default CountryTable;