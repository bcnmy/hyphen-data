import { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
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
} from "@devexpress/dx-react-chart";
import { Stack } from "@devexpress/dx-react-chart";
import { getDailyFee } from "../../service/fee";
import { config } from "../../config";
import NumericGraphLabel from "../basic/NumericGraphLabel";
import { getStartAndEndTime } from "../../utils/getStartAndEndTime";

const useStyles = makeStyles({
    root: {
        padding: "5px",
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

export default function FeeEarnedGraph({ chainIds, days = 30 }) {
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
                                acc[`amount${chainId}`] =
                                    dailyFeesMap[chainId][date];
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
            {dailyFee && chainNames && dailyFee.length > 0 && (
                <Chart data={dailyFee} height="300">
                    <ArgumentAxis />
                    <ValueAxis labelComponent={NumericGraphLabel} />

                    {chainIds &&
                        chainIds.map((chainId, index) => (
                            <BarSeries
                                valueField={`amount${chainId}`}
                                argumentField="date"
                                name={config.chainIdMap[chainId].name}
                                key={`BarGraph_${index}`}
                                barWidth="0.2"
                                color={config.chainIdMap[chainId].color}
                            />
                        ))}

                    <Stack stacks={[{ series: chainNames }]} />
                    <Animation />
                    <Legend verticalAlignment="bottom" />

                    <Title
                        text={`Daily LP Fee (USD)`}
                        textComponent={TextComponent}
                    />
                    <EventTracker />
                    <HoverState />
                    <Tooltip />
                </Chart>
            )}
        </div>
    );
}
