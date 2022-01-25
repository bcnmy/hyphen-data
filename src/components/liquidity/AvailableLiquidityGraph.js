import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { config } from "../../config";
import { useSelector } from "react-redux";
import { getBalance, getLiquidityAdded } from "../../service/token";
import { GroupedBarGraph } from "../graphs/GroupedBarGraph";

const useStyles = makeStyles({
    root: {
        padding: "12px",
        height: "354px",
        border: "1px solid #dddddd",
        borderRadius: "10px",
    },
    graphTitle: {
        display: "inline-block",
        textAlign: "left",
        fontSize: "18px",
        marginLeft: "32px",
        marginBottom: "0",
    },
});

export default function AvailableLiquidityGraph({
    chainId,
    supportedTokenSymbols,
}) {
    const graphTitle = `Available Liquidity (${config.chainIdMap[chainId].name})`;
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
                                Available: Number.parseFloat(tokenBalance),
                                AvailableColor:
                                    config.chainIdMap[chainId].color,
                                Total: Number.parseFloat(liquidityAdded),
                                TotalColor: "#ff7043",
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
            <h2 className={classes.graphTitle}>{graphTitle}</h2>
            <GroupedBarGraph
                ariaLabel={graphTitle}
                axisBottomName="Token"
                axisLeftName="Liquidity"
                data={liquidityData}
                indexBy="supportedTokenSymbol"
                keys={["Available", "Total"]}
            />
        </div>
    );
}
