import "./App.css";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./components/Header";
import Home from "./components/page/Home";
import TransferDetails from "./components/page/TransferDetails";
import { useSelector, useDispatch } from "react-redux";
import { updateSearchState } from "./redux";
import { Container } from "@material-ui/core";
let { config } = require("./config");

const useStyles = makeStyles((theme) => ({
    root: {
        fontFamily: "Roboto Mono",
        padding: "0 20px 20px",
        [theme.breakpoints.between("xs", "sm")]: {
            padding: "0 24px 24px",
        },
    },
}));

function App() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const currentPage = useSelector((state) => state.root.currentPage);

    const [currentComponent, setCurrentComponent] = useState();

    useEffect(() => {
        if (
            config.supportedChainsArray &&
            config.supportedChainsArray.length > 0
        ) {
            dispatch(
                updateSearchState({
                    networkId: config.supportedChainsArray[0].chainId,
                })
            );
        }
    }, [dispatch]);

    useEffect(() => {
        if (currentPage) {
            switch (currentPage) {
                case config.PAGE.HOME:
                    setCurrentComponent(<Home />);
                    break;
                case config.PAGE.TRANSFER_DETAILS:
                    setCurrentComponent(<TransferDetails />);
                    break;
                default:
                    setCurrentComponent(<Home />);
                    break;
            }
        }
    }, [currentPage]);

    return (
        <Container maxWidth="xl" className={classes.root}>
            <Header />
            {currentComponent}
        </Container>
    );
}

export default App;
