import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import TotalDepositPerToken from "../deposit/TotalDepositPerToken";
import CumulativeDeposit from "../deposit/CumulativeDeposit";
import UniqueWalletCount from "../user/UniqueWalletCount";
import TotalDepositPerNetwork from "../deposit/TotalDepositPerNetwork";
import TotalDepositWithDuration from "../deposit/TotalDepositWithDuration";
import DailyDepositGraph from "../deposit/DailyDepositGraph";
import FeeEarnedGraph from "../fee/FeeEarnedGraph";
import AverageTransferTime from "../transfer/AverageTransferTime";
import AvailableLiquidity from "../liquidity/AvailableLiquidity";
import { Container } from "@material-ui/core";

let { config } = require("../../config");

const useStyles = makeStyles((theme) => ({
    totalDepositContainer: {
        padding: "10px",
    },
    cumulativeDataRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    },
    chainDataRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    },
    graphContainer: {
        padding: "15px",
    },
    graphComponentRow: {
        display: "grid",
        [theme.breakpoints.between("sm", "md")]: {
            gridTemplateColumns: "repeat(auto-fit, 1fr)",
        },
        "@media (min-width: 1280px)": {
            gridTemplateColumns: "repeat(auto-fit, minmax(554px, 1fr))",
        },
    },
}));

export default function Home(props) {
    const classes = useStyles();

    let durationStyle = {
        backgroundImage: "none",
        color: "#615CCD",
        border: "2px solid #111",
    };

    let supportedChainIds = [];
    if (config.supportedChainArrray && config.supportedChainArrray.length > 0) {
        config.supportedChainArrray.forEach((chain) =>
            supportedChainIds.push(chain.chainId)
        );
    }

    return (
        <Container maxWidth="xl">
            <div className={classes.totalDepositContainer}>
                <div className={classes.cumulativeDataRow}>
                    <TotalDepositWithDuration
                        chainIds={supportedChainIds}
                        days={1}
                        title="24 hr Volume"
                        showComparision={true}
                        lightBackground={true}
                        style={durationStyle}
                    />
                    <CumulativeDeposit
                        title="Total Volume"
                        chainIds={supportedChainIds}
                        style={durationStyle}
                    />
                    <UniqueWalletCount
                        title="Unique User Count"
                        chainIds={supportedChainIds}
                        style={durationStyle}
                    />
                    <AverageTransferTime
                        style={durationStyle}
                        fromChainId={supportedChainIds[0]}
                        toChainId={supportedChainIds[2]}
                    />
                    {/* <TotalDepositPerNetwork chainId={5} title="Cumulative Volume"/>
                    <TotalDepositPerNetwork chainId={80001} title="Cumulative Volume"/> */}

                    {/* <TotalDepositPerToken tokenSymbol="USDC" chainId={5}/>
                    <TotalDepositPerToken tokenSymbol="USDT" chainId={5}/>
                    <TotalDepositPerToken tokenSymbol="USDC" chainId={80001}/>
                    <TotalDepositPerToken tokenSymbol="USDT" chainId={80001}/> */}
                </div>

                {config.supportedChainArrray &&
                    config.supportedChainArrray.length > 0 &&
                    config.supportedChainArrray.map((item, index) => (
                        <div
                            className={classes.chainDataRow}
                            key={`NetworkRow_${index}`}
                        >
                            <TotalDepositWithDuration
                                chainIds={[item.chainId]}
                                days={1}
                                title="24 hr Volume"
                                showComparision={true}
                            />
                            <CumulativeDeposit
                                title="Total Volume"
                                chainIds={[item.chainId]}
                            />
                            <UniqueWalletCount
                                title="Unique User Count"
                                chainIds={[item.chainId]}
                            />
                        </div>
                    ))}
            </div>
            <div className={classes.graphContainer}>
                <div className={classes.graphComponentRow}>
                    <DailyDepositGraph chainIds={supportedChainIds} days={15} />
                    <FeeEarnedGraph chainIds={supportedChainIds} days={15} />
                </div>
                <div className={classes.graphComponentRow}>
                    {config.supportedChainArrray &&
                        config.supportedChainArrray.length > 0 &&
                        config.supportedChainArrray.map((item, index) => (
                            <AvailableLiquidity
                                chainId={item.chainId}
                                supportedTokenSymbols={["USDT", "USDC"]}
                                key={`AL_${index}`}
                            />
                        ))}
                </div>
                <div className={classes.graphComponentRow}>
                    {config.supportedChainArrray &&
                        config.supportedChainArrray.length > 0 &&
                        config.supportedChainArrray.map((item, index) => (
                            <AvailableLiquidity
                                chainId={item.chainId}
                                supportedTokenSymbols={["ETH"]}
                                key={`AL_${index}`}
                            />
                        ))}
                </div>
            </div>
        </Container>
    );
}
