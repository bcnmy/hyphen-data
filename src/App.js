import "./App.css";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import HyphenIcon from "./assets/Hyphen_icon.png";
import Header from "./components/Header";
import Home from "./components/page/Home";
import TransferDetails from "./components/page/TransferDetails";
import { useSelector, useDispatch } from "react-redux";
import { updateSearchState } from "./redux";
let { config } = require("./config");

const useStyles = makeStyles({
    root: {
        margin: "0px",
        fontFamily: "Roboto Mono!important",
    },
});

function App() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const currentPage = useSelector((state) => state.root.currentPage);

    const [currentComponent, setCurrentComponent] = useState();

    useEffect(() => {
        if (
            config.supportedChainArrray &&
            config.supportedChainArrray.length > 0
        ) {
            dispatch(
                updateSearchState({
                    networkId: config.supportedChainArrray[0].chainId,
                })
            );
        }
    }, []);

    useEffect(() => {
        if (currentPage) {
            switch (currentPage) {
                case config.PAGE.HOME:
                    setCurrentComponent(<Home />);
                    break;
                case config.PAGE.TRANSFER_DETAILS:
                    setCurrentComponent(<TransferDetails />);
                    break;
            }
        }
    }, [currentPage]);

    return (
        <div className={classes.root}>
            <Header title="Hyphen" logo={HyphenIcon} />
            {currentComponent}
        </div>
    );
}

export default App;
