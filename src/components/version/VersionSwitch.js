import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import { useSelector, useDispatch } from "react-redux";
import Select from "@material-ui/core/Select";
import { updateRootState } from "../../redux";

const useStyles = makeStyles((theme) => ({
    formControl: {
        marginRight: "8px",
        minWidth: 120,
        [theme.breakpoints.only("xs")]: {
            marginRight: "0px",
            marginBottom: "8px",
        },
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function VersionSwitch(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const version = useSelector((state) => state.root.version);

    const handleChange = (event) => {
        const _version = event.target.value;
        dispatch(updateRootState({ version: _version }));
    };

    return (
        <FormControl
            variant="outlined"
            className={classes.formControl}
            size="small"
        >
            <InputLabel htmlFor="simple-select-outlined">Version</InputLabel>
            <Select
                value={version}
                onChange={handleChange}
                label="Version"
                inputProps={{
                    name: "version",
                    id: "simple-select-outlined",
                }}
            >
                <MenuItem value="v1">v1</MenuItem>
                <MenuItem value="v2">v2</MenuItem>
            </Select>
        </FormControl>
    );
}
