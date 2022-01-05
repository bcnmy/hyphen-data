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
    Stack,
} from "@devexpress/dx-react-chart";
import { getDailyDepositsUSD } from "../../service/deposit";
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

export default function DailyDepositGraph({ chainIds, days = 30 }) {
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
                                acc[`amount${chainId}`] =
                                    dailyDepositsMap[chainId][date];
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
            {dailyDeposits && chainNames && dailyDeposits.length > 0 && (
                <Chart data={dailyDeposits} height="300">
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
                        text={`Daily Volume (USD)`}
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
