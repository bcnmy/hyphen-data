import { useEffect, useState } from 'react';
import { scaleBand } from '@devexpress/dx-chart-core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from  'clsx';
import {
    Chart,
    BarSeries,
    ArgumentAxis,
    ValueAxis,
    Legend,
    Title,
    Tooltip
  } from '@devexpress/dx-react-chart-material-ui';
import { scaleTime } from 'd3-scale';
import { ArgumentScale, Animation, EventTracker, HoverState } from '@devexpress/dx-react-chart';
import { ValueScale, Stack } from '@devexpress/dx-react-chart';
import { getDailyFee } from '../../service/fee';
import { config } from '../../config';

const useStyles = makeStyles({
  root: {
      padding: "5px",
      margin: "0 5px",
      width: "680px",
      height: "310px!important",
      border: "2px solid #615CCD",
      borderRadius: "5px"
  }
});

const styles = {
    titleText: {
        textAlign: 'left',
        padding: "0px 5px 10px 5px",
        fontSize: "20px"
    }
};

const TextComponent = withStyles(styles)(({ classes, ...restProps }) => (
    <Title.Text {...restProps} className={classes.titleText} />
));

const noOfSecondsInDay = 86400;
export default function FeeEarnedGraph(props) {
    const classes = useStyles();
    const [dailyFee, setDailyFee] = useState([]);
    const [chainNameArray, setChainNameArray] = useState();

    useEffect(()=>{
        const now = Date.now();
        let chainIds = props.chainIds;
        let numOfDays = props.days || 30;
        if(chainIds) {
            const curTimeInSec = parseInt(now/1000);
            let startTime = curTimeInSec - (noOfSecondsInDay*numOfDays);
            let endTime = curTimeInSec;
            let _chainNameArray = [];
            for(let index = 0; index < chainIds.length; index++) {
                let item = chainIds[index];
                _chainNameArray.push(config.chainIdMap[item].name)
            }
            setChainNameArray(_chainNameArray);
            fetchDailyFee(props.chainIds, startTime, endTime);
        }
    }, []);

    let fetchDailyFee = async (chainIds, startTime, endTime) => {
        try {
            let dailyDepositMap = {}
            for(let index = 0; index < chainIds.length; index++) {
                let item = chainIds[index];
                dailyDepositMap[item] = await getDailyFee(item, startTime, endTime);
            }
            console.log(dailyDepositMap);

            let dailyDepositArray = [];
            let dateArray= [];
            for(let index = 0; index < chainIds.length; index++) {
                let item = chainIds[index];
                if(dateArray.length < Object.keys(dailyDepositMap[item]).length) {
                    dateArray = Object.keys(dailyDepositMap[item]);
                }
            }
            for(let index = 0; index < dateArray.length; index++) {
                let key = dateArray[index];
                let date = new Date(key * 1000);
                
                let obj = {};
                obj["date"] = `${date.getDate()}/${date.getMonth()+1}`;
                for(let index = 0; index < chainIds.length; index++) {
                    let item = chainIds[index];
                    obj[`amount${item}`] = dailyDepositMap[item][key];
                }

                dailyDepositArray.push(obj);
            }
            setDailyFee(dailyDepositArray);
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <div className={classes.root}>
            {dailyFee && chainNameArray && dailyFee.length > 0 &&
                <Chart data={dailyFee} height="300" >

                    <ValueAxis />
                    <ArgumentAxis />

                    {props.chainIds && 
                        props.chainIds.map((item, index)=>
                            <BarSeries
                                valueField={`amount${item}`}
                                argumentField="date"
                                name={config.chainIdMap[item].name}
                                key={`BarGraph_${index}`}
                                barWidth="0.2"
                                color={config.chainIdMap[item].color}
                            />
                        )
                    }

                    <Stack
                        stacks={[
                            { series: chainNameArray },
                        ]}
                    />
                    <Animation />
                    <Legend 
                        verticalAlignment="bottom"
                        />

                    <Title text={`Daily Fee (USD)`} textComponent={TextComponent}/>
                    <EventTracker />
                    <HoverState />
                    <Tooltip />
                </Chart>
            }
        </div>
    )
}