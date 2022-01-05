import { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { config } from "../../config";
import { useSelector } from "react-redux";
import { getBalance, getLiquidityAdded } from "../../service/token";
import {
    Chart,
    BarSeries,
    ArgumentAxis,
    ValueAxis,
    Legend,
    Title,
    Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import {
    Animation,
    EventTracker,
    HoverState,
    Stack,
} from "@devexpress/dx-react-chart";
import NumericGraphLabel from "../basic/NumericGraphLabel";

const useStyles = makeStyles({
    root: {
        padding: "5px",
        margin: "12px",
        height: "310px!important",
        border: "2px solid #615CCD",
        borderRadius: "5px",
    },
});

const styles = {
    titleText: {
        textAlign: "left",
        padding: "0px 5px 10px 5px",
        fontSize: "20px",
    },
};

const TextComponent = withStyles(styles)(({ classes, ...restProps }) => (
    <Title.Text {...restProps} className={classes.titleText} />
));

export default function AvailableLiquidityGraph({
    chainId,
    supportedTokenSymbols,
}) {
    const classes = useStyles();

    const [error, setError] = useState();
    const [liquidityData, setLiquidityData] = useState([]);

    const version = useSelector((state) => state.root.version);

    useEffect(() => {
        async function fetchAvailableLiquidity(chainId) {
            try {
                const liquidityData = [];
                for (let supportedTokenSymbol of supportedTokenSymbols) {
                    const tokenInfo =
                        config.tokensMap[supportedTokenSymbol][chainId];

                    if (tokenInfo) {
                        const { address: tokenAddress } = tokenInfo;
                        const lpManagerAddress =
                            config.chainIdMap[chainId].LPManagerAddress[
                                version
                            ];
                        const tokenBalance = await getBalance(
                            tokenAddress,
                            chainId,
                            lpManagerAddress
                        );
                        const liquidityAdded = await getLiquidityAdded(
                            tokenAddress,
                            chainId,
                            lpManagerAddress
                        );
                        if (tokenBalance) {
                            liquidityData.push({
                                supportedTokenSymbol,
                                liquidity: Number.parseFloat(tokenBalance),
                                totalLiquidity:
                                    Number.parseFloat(liquidityAdded),
                            });
                        }
                    } else {
                        console.info(
                            `Token ${supportedTokenSymbol} is not supported`
                        );
                    }
                }
                setLiquidityData(liquidityData);
            } catch (error) {
                console.log(error);
            }
        }

        setLiquidityData([]);
        if (chainId) {
            fetchAvailableLiquidity(chainId);
        } else {
            setError("No chainId passed to component");
        }
    }, [chainId, supportedTokenSymbols, version]);

    return (
        <div className={classes.root}>
            {liquidityData && liquidityData.length > 0 && (
                <Chart data={liquidityData} height="300">
                    <ArgumentAxis />
                    <ValueAxis labelComponent={NumericGraphLabel} />

                    <BarSeries
                        valueField="liquidity"
                        argumentField="supportedTokenSymbol"
                        name="Available"
                        color={config.chainIdMap[chainId].color}
                    />
                    <BarSeries
                        valueField="totalLiquidity"
                        argumentField="supportedTokenSymbol"
                        name="Total"
                    />
                    <Legend verticalAlignment="bottom" />

                    <Stack />
                    <Animation />
                    <Title
                        text={`Available Liquidity (${config.chainIdMap[chainId].name})`}
                        textComponent={TextComponent}
                    />
                    <EventTracker />
                    <HoverState />
                    <Tooltip />
                </Chart>
            )}
            {(!liquidityData || liquidityData.length === 0) && (
                <div>{error}</div>
            )}
        </div>
    );
}
