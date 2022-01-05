import { makeStyles } from "@material-ui/core/styles";
import SearchBar from "./search/SearchBar";
import { useDispatch } from "react-redux";
import { config } from "../config";
import { updateRootState } from "../redux";
import VersionSwitch from "./version/VersionSwitch";
import hyphenLogo from "../assets/hyphen-logo.svg";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "12px",
        padding: "30px",
        background: "#f8f8f8",
        position: "sticky",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "auto",
        minHeight: "108px",
        zIndex: "10",
        borderRadius: "10px",
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
        width: "auto",
        height: "32px",
    },
    filterContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
}));

export default function Header() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const showHomePage = () => {
        dispatch(updateRootState({ currentPage: config.PAGE.HOME }));
    };
    return (
        <header className={classes.root}>
            <div className={classes.heading} onClick={showHomePage}>
                <img src={hyphenLogo} alt="Hyphen" className={classes.logo} />
            </div>
            <VersionSwitch />
            <SearchBar />
        </header>
    );
}
