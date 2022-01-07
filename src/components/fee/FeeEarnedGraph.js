import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { getDailyFee } from "../../service/fee";
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

export default function FeeEarnedGraph({ chainIds, days = 30 }) {
    const graphTitle = "Daily LP Fee (USD)";
    const classes = useStyles();
    const [dailyFee, setDailyFee] = useState([]);
    const [chainNames, setChainNames] = useState();

    const version = useSelector((state) => state.root.version);

    useEffect(() => {
        async function fetchDailyFee(chainIds, startTime, endTime) {
            try {
                const dailyFeesMap = {};
                for (let chainId of chainIds) {
                    dailyFeesMap[chainId] = await getDailyFee(
                        chainId,
                        startTime,
                        endTime,
                        version
                    );
                }
                const dates = Object.keys(dailyFeesMap[chainIds[0]]);
                const dailyFeesArray = dates.reduce((acc, date) => {
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
                                    dailyFeesMap[chainId][date] || 0;
                                acc[`${chainName}Color`] =
                                    config.chainIdMap[chainId].color;
                                return acc;
                            }, {}),
                        },
                    ];
                }, []);
                setDailyFee(dailyFeesArray);
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
            fetchDailyFee(chainIds, startTime, endTime);
        }
    }, [chainIds, days, version]);

    return (
        <div className={classes.root}>
            <h2 className={classes.graphTitle}>{graphTitle}</h2>
            <StackedBarGraph
                ariaLabel={graphTitle}
                axisBottomName="Date"
                axisLeftName="Fee"
                data={dailyFee}
                indexBy="date"
                keys={chainNames}
            />
        </div>
    );
}
