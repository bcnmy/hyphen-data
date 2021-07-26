import React, { useState, useEffect } from "react";
import "./App.css";
import Table from '@material-ui/core/Table';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const { config } = require("./config");

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
});

let totalVolume=0;
let totalGasSpent=0;

function App() {
    const classes = useStyles();
    const [burnNexitData, setBurnNexit] = useState([]);

    useEffect(() => {

        let requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        let fromChainId=80001;
        let startTime=0;
        let endTime=1627225457000;

        fetch(`http://localhost:3000/api/v1/data/rebalance?fromChainId=${fromChainId}&startTime=${startTime}&endTime=${endTime}`, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                setBurnNexit(result.withdrawList);
            },
            (error) => {
                setBurnNexit(error);
            }
        )
        
    }, []);

    let totalAmount = (amount) => {
        console.log(amount)
        totalVolume = parseInt(totalVolume) + parseInt(amount);
    }

    let totalGas = (withdrawFee, burnFee, exitFee, lpFundHash) => {
        console.log(withdrawFee, burnFee, exitFee, lpFundHash)
        if(withdrawFee){
            totalGasSpent = parseFloat(totalGasSpent) + parseFloat(withdrawFee);
        }
        if(burnFee){
            totalGasSpent = parseFloat(totalGasSpent) + parseFloat(burnFee);
        }
        if(exitFee){
            totalGasSpent = parseFloat(totalGasSpent) + parseFloat(exitFee);
        }
        if(lpFundHash){
            totalGasSpent = parseFloat(totalGasSpent) + parseFloat(lpFundHash);
        }
    }

    let printDate = (epochTime) => {
        let d = new Date(epochTime);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    }

    return (
        <div className="App">
            <div> Matic to Eth Rebalancing </div>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Rebalancing Id</TableCell>
                            <TableCell align="center">From Chain Id</TableCell>
                            <TableCell align="center">To Chain Id</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">TokenSymbol</TableCell>
                            <TableCell align="center">Started On</TableCell>
                            <TableCell align="center">Ended On</TableCell>
                            <TableCell align="center">Withdraw Hash</TableCell>
                            <TableCell align="center">Withdraw Fee</TableCell>
                            <TableCell align="center">Withdraw Amount</TableCell>
                            <TableCell align="center">Burn Hash</TableCell>
                            <TableCell align="center">Burn Fee</TableCell>
                            <TableCell align="center">Burn Amount</TableCell>
                            <TableCell align="center">Exit Hash</TableCell>
                            <TableCell align="center">Exit Fee</TableCell>
                            <TableCell align="center">LP Fund Hash</TableCell>
                            <TableCell align="center">LP Fund Fee</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {burnNexitData.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell align="left">{row.rebalancingId}</TableCell>
                                <TableCell align="left">{row.fromChainId}</TableCell>
                                <TableCell align="left">{row.toChainId}</TableCell>
                                <TableCell align="left">{row.status}</TableCell>
                                <TableCell align="left">{row.tokenSymbol}</TableCell>
                                <TableCell align="left">{printDate(row.createdOn)}</TableCell>
                                <TableCell align="left">{printDate(row.updatedOn)}</TableCell>
                                <TableCell align="left">{row.withdrawData.transactionHash}</TableCell>
                                <TableCell align="left">{row.withdrawData.txnFeesInFiat}</TableCell>
                                <TableCell align="left">{row.withdrawData.amount}</TableCell>
                                <TableCell align="left">{row.burnData.burnHash}</TableCell>
                                <TableCell align="left">{row.burnData.burnTxnFeesInFiat}</TableCell>
                                <TableCell align="left">{row.burnData.amount}</TableCell>
                                <TableCell align="left">{row.exitData.exitHash}</TableCell>
                                <TableCell align="left">{row.exitData.exitTxnFeesInFiat}</TableCell>
                                <TableCell align="left">{row.lpFundedData.lpFundHash}</TableCell>
                                <TableCell align="left">{row.lpFundedData.lpFundTxnFeesInFiat}</TableCell>
                                { totalAmount(row.burnData.amount) }
                                { totalGas(row.withdrawData.txnFeesInFiat, row.burnData.burnTxnFeesInFiat, row.exitData.exitTxnFeesInFiat, row.lpFundedData.lpFundTxnFeesInFiat) }
                            
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div>Total Volume Rebalanced: {totalVolume}</div>
            <div>TotalGasSpent: {totalGasSpent}</div>
        </div>
            
  );
}

export default App;