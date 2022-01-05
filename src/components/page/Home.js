import { makeStyles } from "@material-ui/core/styles";
import CumulativeDeposit from "../deposit/CumulativeDeposit";
import UniqueWalletCount from "../user/UniqueWalletCount";
import TotalDepositWithDuration from "../deposit/TotalDepositWithDuration";
import DailyDepositGraph from "../deposit/DailyDepositGraph";
import FeeEarnedGraph from "../fee/FeeEarnedGraph";
import AverageTransferTime from "../transfer/AverageTransferTime";
import AvailableLiquidityGraph from "../liquidity/AvailableLiquidityGraph";
import { Container } from "@material-ui/core";

let { config } = require("../../config");

const useStyles = makeStyles((theme) => ({
    cumulativeDataRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    },
    chainDataRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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

const durationStyle = {
    backgroundImage: "none",
    color: "#615CCD",
    border: "2px solid #111",
};

export default function Home(props) {
    const classes = useStyles();

    const supportedChainIds = config.supportedChainsArray.map(
        (supportedChain) => supportedChain.chainId
    );

    return (
        <>
            <>
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
                </div>

                {config.supportedChainsArray &&
                    config.supportedChainsArray.length > 0 &&
                    config.supportedChainsArray.map((item, index) => (
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
            </>
            <>
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
        </>
    );
}
