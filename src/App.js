import "./App.css";
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TotalDepositPerToken from './components/deposit/TotalDepositPerToken';
import CumulativeDeposit from './components/deposit/CumulativeDeposit';
import UniqueWalletCount from './components/user/UniqueWalletCount';
import TotalDepositPerNetwork from './components/deposit/TotalDepositPerNetwork';
import TotalDepositWithDuration from './components/deposit/TotalDepositWithDuration';
import clsx from "clsx";
import DailyDepositGraph from "./components/deposit/DailyDepositGraph";
import FeeEarnedGraph from "./components/fee/FeeEarnedGraph";
import HyphenIcon from "./assets/Hyphen_icon.png";

let { config } = require("./config");

const useStyles = makeStyles({
  root: {
      padding: "0px",
      margin: "0px",
      fontFamily: 'Roboto Mono!important'
  },
  totalDepositContainer: {
    padding: "10px",
  },
  graphContainer: {
    padding: "15px"
  },
  depositComponentRow: {
      display: "flex",
      flexDirection: "row"
  },
  graphComponentRow: {
    display: "flex",
    flexDirection: "row"
  },
  depositHeading: {
      padding: "10px",
      fontWeight: "bold",
      fontSize: "25px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
  },
  hyphenLogo: {
      width: "24px",
      marginRight: "5px"
  }
});

function App() {
    const classes = useStyles();
    let durationStyle = {
        backgroundImage: "none",
        color: "#615CCD",
        border: "2px solid #111"
    };

    return (
        <div className="root">
            <div className={classes.depositHeading}>
                <img src={HyphenIcon} alt="Hyphen" className={classes.hyphenLogo}/>
                Hyphen
            </div>

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
    );
}

export default App;