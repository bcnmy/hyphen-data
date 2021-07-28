import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from  'clsx';
import TotalDepositPerToken from '../deposit/TotalDepositPerToken';
import CumulativeDeposit from '../deposit/CumulativeDeposit';
import UniqueWalletCount from '../user/UniqueWalletCount';
import TotalDepositPerNetwork from '../deposit/TotalDepositPerNetwork';
import TotalDepositWithDuration from '../deposit/TotalDepositWithDuration';
import DailyDepositGraph from "../deposit/DailyDepositGraph";
import FeeEarnedGraph from "../fee/FeeEarnedGraph";
let { config } = require("../../config");

const useStyles = makeStyles({
  root: {
      
  },
  totalDepositContainer: {
    padding: "10px",
  },
  graphContainer: {
    padding: "15px"
  },
  depositComponentRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
  },
  graphComponentRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default function Home(props) {
    const classes = useStyles();

    let durationStyle = {
        backgroundImage: "none",
        color: "#615CCD",
        border: "2px solid #111"
    };

    return (
        <div className={classes.root}>
            <div className={classes.totalDepositContainer}>
                <div className={classes.depositComponentRow}>
                    <TotalDepositWithDuration 
                        chainIds={[5, 80001]} days={1} title="24 hr Volume" 
                        showComparision={true}
                        lightBackground={true}
                        style={durationStyle}/>
                    <CumulativeDeposit title="Cumulative Volume" chainIds={[5, 80001]}
                        style={durationStyle}/>
                    <UniqueWalletCount title="Unique User Count" chainIds={[5, 80001]}
                        style={durationStyle}/>

                    {/* <TotalDepositPerNetwork chainId={5} title="Cumulative Volume"/>
                    <TotalDepositPerNetwork chainId={80001} title="Cumulative Volume"/> */}

                    {/* <TotalDepositPerToken tokenSymbol="USDC" chainId={5}/>
                    <TotalDepositPerToken tokenSymbol="USDT" chainId={5}/>
                    <TotalDepositPerToken tokenSymbol="USDC" chainId={80001}/>
                    <TotalDepositPerToken tokenSymbol="USDT" chainId={80001}/> */}
                </div>

                {config.supportedChainArrray && config.supportedChainArrray.length > 0 &&
                    config.supportedChainArrray.map((item, index)=>(
                        <div className={classes.depositComponentRow} key={`NetworkRow_${index}`}>
                            <TotalDepositWithDuration chainIds={[item.chainId]} days={1} title="24 hr Volume" showComparision={true}/>
                            <CumulativeDeposit title="Cumulative Volume" chainIds={[item.chainId]} />
                            <UniqueWalletCount title="Unique User Count" chainIds={[item.chainId]} />
                        </div>
                    ))
                }
            </div>
            <div className={classes.graphContainer}>
                <div className={classes.graphComponentRow}>
                    <DailyDepositGraph chainIds={[80001, 5]}/>
                    <FeeEarnedGraph chainIds={[80001, 5]}/>
                </div>
            </div>
        </div>
    )
}