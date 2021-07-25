import "./App.css";
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TotalDepositPerToken from './components/deposit/TotalDepositPerToken';

import TotalDepositPerNetwork from './components/deposit/TotalDepositPerNetwork';
import clsx from "clsx";

let { config } = require("./config");

const useStyles = makeStyles({
  root: {
      padding: "0px",
      margin: "0px"
  },
  totalDepositContainer: {
    padding: "10px"
  },
  depositComponentRow: {
      display: "flex",
      flexDirection: "row,"
  },
  depositHeading: {
      padding: "2px 5px",
      fontWeight: "bold",
      fontSize: "20px"
  }
});

function App() {
    const classes = useStyles();
    
    return (
        <div className="root">
            <div className={classes.totalDepositContainer}>
                <div className={classes.depositHeading}>Total Volume</div>
                <div className={classes.depositComponentRow}>
                    <TotalDepositPerNetwork chainId={5}/>
                    <TotalDepositPerNetwork chainId={80001}/>
                    {/* <TotalDepositPerToken tokenSymbol="USDC" chainId={5}/>
                    <TotalDepositPerToken tokenSymbol="USDT" chainId={5}/>
                    <TotalDepositPerToken tokenSymbol="USDC" chainId={80001}/>
                    <TotalDepositPerToken tokenSymbol="USDT" chainId={80001}/> */}
        
                </div>
            </div>
        </div>
    );
}

export default App;