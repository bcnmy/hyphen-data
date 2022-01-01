import { makeStyles } from "@material-ui/core/styles";
import SearchBar from "./search/SearchBar";
import { useDispatch } from "react-redux";
import { config } from "../config";
import { updateRootState } from "../redux";
import VersionSwitch from "./version/VersionSwitch";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "15px 15px 15px 15px",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "center",
        background: "#fff",
        boxShadow: "0 1px 10px rgb(0 0 0 / 10%)",
        position: "sticky",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "auto",
        minHeight: "72px",
        zIndex: "10",
    },
    heading: {
        cursor: "pointer",
        padding: "2px",
        fontWeight: "bold",
        fontSize: "25px",
        display: "flex",
        flexGrow: 1,
        flexDirection: "row",
        alignItems: "center",
        width: "fit-content",
        [theme.breakpoints.only("xs")]: {
            marginBottom: "8px",
        },
    },
    logo: {
        width: "24px",
        marginRight: "5px",
    },
    filterContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
}));

export default function Header(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const showHomePage = () => {
        dispatch(updateRootState({ currentPage: config.PAGE.HOME }));
    };
    return (
        <div className={classes.root}>
            <div className={classes.heading} onClick={showHomePage}>
                <img
                    src={props.logo}
                    alt={props.title}
                    className={classes.logo}
                />
                {props.title}
            </div>
            <VersionSwitch />
            <SearchBar />
        </div>
    );
}
