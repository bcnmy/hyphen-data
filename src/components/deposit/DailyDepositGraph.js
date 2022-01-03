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

const noOfSecondsInDay = 86400;

function USDLabel({ text, ...restProps }) {
    const formattedText = new Intl.NumberFormat("en-US", {
        notation: "compact",
        compactDisplay: "short",
    }).format(text.replace(/,/g, ''))

    return <ValueAxis.Label {...restProps} text={formattedText} />;
}

export default function DailyDepositGraph(props) {
    const classes = useStyles();
    const [dailyDeposits, setDailyDeposits] = useState([]);
    const [chainNameArray, setChainNameArray] = useState();

    const version = useSelector((state) => state.root.version);

    useEffect(() => {
        const now = Date.now();
        let chainIds = props.chainIds;
        let numOfDays = props.days || 30;
        if (chainIds) {
            const curTimeInSec = parseInt(now / 1000);
            let startTime = curTimeInSec - noOfSecondsInDay * numOfDays;
            let endTime = curTimeInSec;
            let _chainNameArray = [];
            for (let index = 0; index < chainIds.length; index++) {
                let item = chainIds[index];
                _chainNameArray.push(config.chainIdMap[item].name);
            }
            setChainNameArray(_chainNameArray);
            fetchDailyDepositUSD(props.chainIds, startTime, endTime);
        }
    }, [version]);

    let fetchDailyDepositUSD = async (chainIds, startTime, endTime) => {
        try {
            let dailyDepositMap = {};
            for (let index = 0; index < chainIds.length; index++) {
                let item = chainIds[index];
                dailyDepositMap[item] = await getDailyDepositsUSD(
                    item,
                    startTime,
                    endTime,
                    version
                );
            }
            let dailyDepositArray = [];

            let dateArray = [];
            for (let index = 0; index < chainIds.length; index++) {
                let item = chainIds[index];
                if (
                    dateArray.length < Object.keys(dailyDepositMap[item]).length
                ) {
                    dateArray = Object.keys(dailyDepositMap[item]);
                }
            }

            for (let index = 0; index < dateArray.length; index++) {
                let key = dateArray[index];
                let date = new Date(key * 1000);

                let obj = {};
                obj["date"] = `${date.getDate()}/${date.getMonth() + 1}`;
                for (let index = 0; index < chainIds.length; index++) {
                    let item = chainIds[index];
                    obj[`amount${item}`] = dailyDepositMap[item][key];
                }

                dailyDepositArray.push(obj);
            }
            setDailyDeposits(dailyDepositArray);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={classes.root}>
            {dailyDeposits && chainNameArray && dailyDeposits.length > 0 && (
                <Chart data={dailyDeposits} height="300">
                    <ArgumentAxis />
                    <ValueAxis labelComponent={USDLabel} />

                    {props.chainIds &&
                        props.chainIds.map((item, index) => (
                            <BarSeries
                                valueField={`amount${item}`}
                                argumentField="date"
                                name={config.chainIdMap[item].name}
                                key={`BarGraph_${index}`}
                                barWidth="0.2"
                                color={config.chainIdMap[item].color}
                            />
                        ))}

                    <Stack stacks={[{ series: chainNameArray }]} />
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
