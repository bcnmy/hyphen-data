import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import Counter from "../basic/Counter";
import { getDepositTransactions } from "../../service/deposit";
import { getTransferTransaction } from "../../service/transfer";
import { quantile } from "../../service/utils";
import { config } from "../../config";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import leftArrow from "../../assets/left-arrow.svg";
import rightArrow from "../../assets/right-arrow.svg";
import { Box, Grid } from "@material-ui/core";

const ms = require("ms");

const useStyles = makeStyles({
    root: {},
    logoIcon: {
        width: "24px",
        margin: "0px 6px",
    },
    chainInfoContainer: {
        height: "auto",
        minHeight: "54px",
        marginTop: "8px",
        fontSize: "24px",
    },
    swapIcon: {
        margin: "0px 10px",
    },
    chainName: {
        height: "48px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        margin: "0 auto",
        padding: "0px 5px",
    },
});

export default function AverageTransferTime(props) {
    const classes = useStyles();

    const [averageTime, setAverageTime] = useState("...");
    const [averageTimeArray, setAverageTimeArray] = useState([]);

    const [selectedFromChain, setSelectedFromChain] = useState();
    const [selectedToChain, setSelectedToChain] = useState();

    const [sourceChains, setSourceChains] = useState(
        config.supportedChainsArray
    );
    const [destinationChains, setDestinationChains] = useState();

    const version = useSelector((state) => state.root.version);

    // Set the selected from chain and we get all the source chains
    useEffect(() => {
        if (sourceChains && sourceChains.length > 0) {
            if (config.chainIdMap && config.chainIdMap[props.fromChainId]) {
                setSelectedFromChain(config.chainIdMap[props.fromChainId]);
            } else {
                setSelectedFromChain(sourceChains[0]);
            }
        }
    }, [sourceChains]);

    // Set the allowed destination chains, when selectedFromChain is set
    useEffect(() => {
        if (selectedFromChain) {
            let allowedDestinationChains = [];
            for (let index in sourceChains) {
                let chain = sourceChains[index];
                if (chain.chainId != selectedFromChain.chainId) {
                    allowedDestinationChains.push(sourceChains[index]);
                }
            }
            setDestinationChains(allowedDestinationChains);
            if (
                allowedDestinationChains &&
                allowedDestinationChains.length > 0
            ) {
                if (
                    selectedToChain &&
                    allowedDestinationChains.indexOf(selectedToChain) < 0
                ) {
                    setSelectedToChain(allowedDestinationChains[0]);
                } else if (!selectedToChain && props.toChainId != undefined) {
                    setSelectedToChain(config.chainIdMap[props.toChainId]);
                }
            }
        }
    }, [selectedFromChain]);

    useEffect(() => {
        if (selectedFromChain && selectedToChain) {
            fetchAverageTransferTime(
                selectedFromChain.chainId,
                selectedToChain.chainId,
                30
            );
        }
    }, [selectedFromChain, selectedToChain]);

    useEffect(() => {
        if (averageTimeArray && averageTimeArray.length > 0) {
            let q90 = quantile(averageTimeArray, 0.9);
            setAverageTime(ms(q90));
        }
    }, [averageTimeArray]);

    const fetchAverageTransferTime = async (
        fromChainId,
        toChainId,
        numOfTransactions
    ) => {
        setAverageTimeArray([]);
        setAverageTime(". . .");
        let depositTransactions = await getDepositTransactions(
            fromChainId,
            toChainId,
            version,
            numOfTransactions
        );
        if (depositTransactions && depositTransactions.length > 0) {
            for (let index = 0; index < depositTransactions.length; index++) {
                (async (depositTransaction) => {
                    let startTime = parseInt(depositTransaction.timestamp);
                    let transferData = await getTransferTransaction(
                        toChainId,
                        depositTransaction.id,
                        version
                    );
                    if (transferData) {
                        let endTime = parseInt(transferData.timestamp);
                        let timeDiff = parseInt(endTime - startTime) * 1000;

                        setAverageTimeArray((oldArray) => [
                            ...oldArray,
                            timeDiff,
                        ]);
                    }
                })(depositTransactions[index]);
            }
        }
    };

    const onFromChainChanged = async (event) => {
        const _chainId = event.target.value;
        if (_chainId) {
            setSelectedFromChain(config.chainIdMap[_chainId]);
        }
    };

    const onToChainChanged = async (event) => {
        const _chainId = event.target.value;
        if (_chainId) {
            setSelectedToChain(config.chainIdMap[_chainId]);
        }
    };

    let label = (
        <Grid
            container
            spacing={2}
            className={classes.chainInfoContainer}
            alignItems="center"
        >
            <Grid item xs={12} lg={4}>
                {sourceChains && selectedFromChain && (
                    <FormControl
                        variant="outlined"
                        className={classes.chainName}
                        size="small"
                    >
                        <Select
                            className={classes.chainName}
                            value={selectedFromChain.chainId}
                            onChange={onFromChainChanged}
                            inputProps={{
                                name: "version",
                                id: "simple-select-outlined",
                            }}
                        >
                            {sourceChains.map((item, index) => {
                                return (
                                    <MenuItem
                                        value={item.chainId}
                                        key={`ChainItem_${index}`}
                                    >
                                        {item.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                )}
            </Grid>

            <Grid item xs={12} lg={4}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                    }}
                >
                    <Box
                        component="img"
                        src={leftArrow}
                        alt="From chain"
                        sx={{ display: { xs: "none", md: "block" } }}
                    />
                    <div>{averageTime}</div>
                    <Box
                        component="img"
                        src={rightArrow}
                        alt="To chain"
                        sx={{ display: { xs: "none", md: "block" } }}
                    />
                </Box>
            </Grid>

            <Grid item xs={12} lg={4}>
                {destinationChains && selectedToChain && (
                    <FormControl
                        variant="outlined"
                        className={classes.chainName}
                        size="small"
                    >
                        <Select
                            className={classes.chainName}
                            value={selectedToChain.chainId}
                            onChange={onToChainChanged}
                            inputProps={{
                                name: "version",
                                id: "simple-select-outlined",
                            }}
                        >
                            {destinationChains.map((item, index) => {
                                return (
                                    <MenuItem
                                        value={item.chainId}
                                        key={`ChainItem_${index}`}
                                    >
                                        {item.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                )}
            </Grid>
        </Grid>
    );
    return (
        <div className={classes.root}>
            <Counter title="Average Transfer Time" label={label} {...props} />
        </div>
    );
}
