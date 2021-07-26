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
    const [approveNdepositData, setApproveNdepositData] = useState([]);
    // const [totalVolumeRebalanced, setTotalVolumeRebalanced] = useState([]);

    useEffect(() => {

        let requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        let fromChainId=5;
        let startTime=0;
        let endTime=1627225457000;

        fetch(`https://hyphen-test-api.biconomy.io/api/v1/data/rebalance?fromChainId=${fromChainId}&startTime=${startTime}&endTime=${endTime}`, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                setApproveNdepositData(result.withdrawList);
            },
            (error) => {
                setApproveNdepositData(error);
            }
        )
        
    }, []);

    let totalAmount = (amount) => {
        console.log(amount)
        totalVolume = parseInt(totalVolume) + parseInt(amount);
    }

    let totalGas = (withdrawFee, approvalFee, depositFee) => {
        console.log(withdrawFee, approvalFee, depositFee)
        if(withdrawFee){
            totalGasSpent = parseFloat(totalGasSpent) + parseFloat(withdrawFee);
        }
        if(approvalFee){
            totalGasSpent = parseFloat(totalGasSpent) + parseFloat(approvalFee);
        }
        if(depositFee){
            totalGasSpent = parseFloat(totalGasSpent) + parseFloat(depositFee);
        }
    }

    return (
        <div className="App">
            <div> Eth to Matic Rebalancing </div>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Rebalancing Id</TableCell>
                            <TableCell align="center">From Chain Id</TableCell>
                            <TableCell align="center">To Chain Id</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">TokenSymbol</TableCell>
                            <TableCell align="center">Withdraw Hash</TableCell>
                            <TableCell align="center">Withdraw Fee</TableCell>
                            <TableCell align="center">Withdraw Amount</TableCell>
                            <TableCell align="center">Approve Hash</TableCell>
                            <TableCell align="center">Approve Fee</TableCell>
                            <TableCell align="center">Approve Amount</TableCell>
                            <TableCell align="center">Deposit Hash</TableCell>
                            <TableCell align="center">Deposit Fee</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {approveNdepositData.map((row) => (
                            <TableRow>
                                <TableCell align="left" key={row.rebalancingId}>{row.rebalancingId}</TableCell>
                                <TableCell align="left" key={row.fromChainId}>{row.fromChainId}</TableCell>
                                <TableCell align="left" key={row.toChainId}>{row.toChainId}</TableCell>
                                <TableCell align="left" key={row.status}>{row.status}</TableCell>
                                <TableCell align="left" key={row.tokenSymbol}>{row.tokenSymbol}</TableCell>
                                <TableCell align="left" key={row.withdrawData.transactionHash}>{row.withdrawData.transactionHash}</TableCell>
                                <TableCell align="left" key={row.withdrawData.txnFeesInFiat}>{row.withdrawData.txnFeesInFiat}</TableCell>
                                <TableCell align="left" key={row.withdrawData.amount}>{row.withdrawData.amount}</TableCell>
                                <TableCell align="left" key={row.approveData.approveHash}>{row.approveData.approveHash}</TableCell>
                                {row.approveData.approveTxnFeesInFiat &&
                                    <TableCell align="left" key={row.approveData.approveTxnFeesInFiat}>{row.approveData.approveTxnFeesInFiat}</TableCell>
                                }
                                {!row.approveData.approveTxnFeesInFiat &&
                                    <TableCell align="left">NA</TableCell>
                                }
                                <TableCell align="left" key={row.approveData.amount}>{row.approveData.amount}</TableCell>
                                <TableCell align="left" key={row.depositData.depositHash}>{row.depositData.depositHash}</TableCell>
                                <TableCell align="left" key={row.depositData.depositTxnFeesInFiat}>{row.depositData.depositTxnFeesInFiat}</TableCell>
                                { totalAmount(row.approveData.amount) }
                                { totalGas(row.withdrawData.txnFeesInFiat, row.approveData.approveTxnFeesInFiat, row.depositData.depositTxnFeesInFiat) }
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