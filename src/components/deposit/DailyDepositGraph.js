import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { getDailyDepositsUSD } from "../../service/deposit";
import { config } from "../../config";
import { getStartAndEndTime } from "../../utils/getStartAndEndTime";
import { StackedBarGraph } from "../graphs/StackedBarGraph";

const useStyles = makeStyles({
    root: {
        padding: "12px",
        height: "340px",
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

export default function DailyDepositGraph({ chainIds, days = 30 }) {
    const graphTitle = "Daily Volume (USD)";
    const classes = useStyles();
    const [dailyDeposits, setDailyDeposits] = useState([]);
    const [chainNames, setChainNames] = useState();

    const version = useSelector((state) => state.root.version);

    useEffect(() => {
        async function fetchDailyDepositUSD(chainIds, startTime, endTime) {
            try {
                const dailyDepositsMap = {};
                for (let chainId of chainIds) {
                    dailyDepositsMap[chainId] = await getDailyDepositsUSD(
                        chainId,
                        startTime,
                        endTime,
                        version
                    );
                }
                const dates = Object.keys(dailyDepositsMap[chainIds[0]]);
                const dailyDepositArray = dates.reduce((acc, date) => {
                    const dateObject = new Date(date * 1000);
                    return [
                        ...acc,
                        {
                            date: `${dateObject.getDate()}/${
                                dateObject.getMonth() + 1
                            }`,
                            ...chainIds.reduce((acc, chainId) => {
                                const chainName =
                                    config.chainIdMap[chainId].name;
                                acc[`${chainName}`] =
                                    dailyDepositsMap[chainId][date] || 0;
                                acc[`${chainName}Color`] =
                                    config.chainIdMap[chainId].color;
                                return acc;
                            }, {}),
                        },
                    ];
                }, []);
                setDailyDeposits(dailyDepositArray);
            } catch (error) {
                console.error(error);
            }
        }

        if (chainIds) {
            const { startTime, endTime } = getStartAndEndTime(days);
            const chainNames = chainIds.map((chainId) => {
                return config.chainIdMap[chainId].name;
            });
            setChainNames(chainNames);
            fetchDailyDepositUSD(chainIds, startTime, endTime);
        }
    }, [chainIds, days, version]);

    return (
        <div className={classes.root}>
            <h2 className={classes.graphTitle}>{graphTitle}</h2>
            <StackedBarGraph
                ariaLabel={graphTitle}
                axisBottomName="Date"
                axisLeftName="Volume"
                data={dailyDeposits}
                indexBy="date"
                keys={chainNames}
            />
        </div>
    );
}
