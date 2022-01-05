import { makeStyles } from "@material-ui/core/styles";
import CumulativeDeposit from "../deposit/CumulativeDeposit";
import UniqueWalletCount from "../user/UniqueWalletCount";
import TotalDepositWithDuration from "../deposit/TotalDepositWithDuration";
import DailyDepositGraph from "../deposit/DailyDepositGraph";
import FeeEarnedGraph from "../fee/FeeEarnedGraph";
import AverageTransferTime from "../transfer/AverageTransferTime";
import AvailableLiquidityGraph from "../liquidity/AvailableLiquidityGraph";
import { Grid } from "@material-ui/core";

let { config } = require("../../config");

const useStyles = makeStyles((theme) => ({
    cumulativeDataRow: {
        marginBottom: "4px",
    },
    chainDataRow: {
        marginBottom: "8px",
    },
    graphComponentRow: {
        display: "grid",
        [theme.breakpoints.between("xs", "md")]: {
            gridTemplateColumns: "repeat(auto-fit, 1fr)",
        },
        "@media (min-width: 1280px)": {
            gridTemplateColumns: "repeat(auto-fit, minmax(554px, 1fr))",
        },
    },
}));

const durationStyle = {
    background: "rgba(97, 92, 205, 0.1)",
    color: "#615CCD",
    border: "none",
};

export default function Home(props) {
    const classes = useStyles();

    const supportedChainIds = config.supportedChainsArray.map(
        (supportedChain) => supportedChain.chainId
    );

    return (
        <>
            <Grid container spacing={1} className={classes.cumulativeDataRow}>
                <Grid item xs={12} md={4}>
                    <TotalDepositWithDuration
                        chainIds={supportedChainIds}
                        days={1}
                        title="24 hr Volume"
                        showComparision={true}
                        lightBackground={true}
                        style={durationStyle}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <CumulativeDeposit
                        title="Total Volume"
                        chainIds={supportedChainIds}
                        style={durationStyle}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <UniqueWalletCount
                        title="Unique User Count"
                        chainIds={supportedChainIds}
                        style={durationStyle}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <AverageTransferTime
                        style={durationStyle}
                        fromChainId={supportedChainIds[0]}
                        toChainId={supportedChainIds[2]}
                    />
                </Grid>
            </Grid>

            {config.supportedChainsArray &&
            config.supportedChainsArray.length > 0 ? (
                <Grid container spacing={1} className={classes.chainDataRow}>
                    {config.supportedChainsArray.map((item, index) => (
                        <>
                            <Grid item xs={12} md={4}>
                                <TotalDepositWithDuration
                                    chainIds={[item.chainId]}
                                    days={1}
                                    title="24 hr Volume"
                                    showComparision={true}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <CumulativeDeposit
                                    title="Total Volume"
                                    chainIds={[item.chainId]}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <UniqueWalletCount
                                    title="Unique User Count"
                                    chainIds={[item.chainId]}
                                />
                            </Grid>
                        </>
                    ))}
                </Grid>
            ) : null}

            <div className={classes.graphComponentRow}>
                <DailyDepositGraph chainIds={supportedChainIds} days={15} />
                <FeeEarnedGraph chainIds={supportedChainIds} days={15} />
            </div>
            <div className={classes.graphComponentRow}>
                {config.supportedChainsArray &&
                    config.supportedChainsArray.length > 0 &&
                    config.supportedChainsArray.map((item, index) => (
                        <AvailableLiquidityGraph
                            chainId={item.chainId}
                            supportedTokenSymbols={["USDT", "USDC"]}
                            key={`AL_${index}`}
                        />
                    ))}
            </div>
            <div className={classes.graphComponentRow}>
                {config.supportedChainsArray &&
                    config.supportedChainsArray.length > 0 &&
                    config.supportedChainsArray.map((item, index) => (
                        <AvailableLiquidityGraph
                            chainId={item.chainId}
                            supportedTokenSymbols={["ETH"]}
                            key={`AL_${index}`}
                        />
                    ))}
            </div>
        </>
    );
}
