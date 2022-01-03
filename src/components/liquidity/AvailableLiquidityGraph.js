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

export default function AvailableLiquidityGraph(props) {
    const classes = useStyles();

    const [error, setError] = useState();
    const [liquidityData, setLiquidityData] = useState([]);

    const version = useSelector((state) => state.root.version);

    useEffect(() => {
        setLiquidityData([]);
        let chainId = props.chainId;
        if (chainId) {
            fetchAvailableLiquidity(chainId);
        } else {
            setError("No chainId passed to component");
        }
    }, [version]);

    const fetchAvailableLiquidity = async (chainId) => {
        try {
            let supportedTokens = props.supportedTokenSymbols;
            let _liquidityData = [];
            for (let index = 0; index < supportedTokens.length; index++) {
                let tokenSymbol = supportedTokens[index];
                let tokenInfo = config.tokensMap[tokenSymbol][chainId];
                if (tokenInfo) {
                    let tokenAddress = tokenInfo.address;
                    let lpManagerAddress =
                        config.chainIdMap[chainId].LPManagerAddress[version];
                    let tokenBalance = await getBalance(
                        tokenAddress,
                        chainId,
                        lpManagerAddress
                    );
                    let liquidityAdded = await getLiquidityAdded(
                        tokenAddress,
                        chainId,
                        lpManagerAddress
                    );
                    if (tokenBalance != undefined) {
                        tokenBalance = parseFloat(tokenBalance);
                        _liquidityData.push({
                            tokenSymbol,
                            liquidity: tokenBalance,
                            totalLiquidity: parseFloat(liquidityAdded),
                        });
                        setLiquidityData([
                            ..._liquidityData,
                            { tokenSymbol, liquidity: tokenBalance },
                        ]);
                    }
                } else {
                    console.info(`Token ${tokenSymbol} is not supported`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className={classes.root}>
            {liquidityData && liquidityData.length > 0 && (
                <Chart data={liquidityData} height="300">
                    <ArgumentAxis />
                    <ValueAxis labelComponent={NumericGraphLabel} />

                    <BarSeries
                        valueField="liquidity"
                        argumentField="tokenSymbol"
                        name="Available"
                        color={config.chainIdMap[props.chainId].color}
                    />
                    <BarSeries
                        valueField="totalLiquidity"
                        argumentField="tokenSymbol"
                        name="Total"
                    />
                    <Legend verticalAlignment="bottom" />

                    <Stack />
                    <Animation />
                    <Title
                        text={`Available Liquidity (${
                            config.chainIdMap[props.chainId].name
                        })`}
                        textComponent={TextComponent}
                    />
                    <EventTracker />
                    <HoverState />
                    <Tooltip />
                </Chart>
            )}
            {(!liquidityData || liquidityData.length == 0) && (
                <div> {error} </div>
            )}
        </div>
    );
}
