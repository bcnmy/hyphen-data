import "./App.css";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
let { config } = require("./config");

const abiDecoder = require('abi-decoder');
abiDecoder.addABI(config.LP_MANAGER_ABI);

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const ETHEREUM_URL = "https://api.thegraph.com/subgraphs/name/divyan73/lpmanagergoerli";
const MATIC_URL = "https://api.thegraph.com/subgraphs/name/divyan73/lpmanagermumbai";

const ethereumGraphClient = new ApolloClient({
    uri: ETHEREUM_URL,
    cache: new InMemoryCache()
});

const maticGraphClient = new ApolloClient({
    uri: MATIC_URL,
    cache: new InMemoryCache()
});

let getDepositData = (depositHash) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await maticGraphClient.query({
                query: gql(`
                query {
                    fundsDepositeds(where: {id: "${depositHash}"}) {
                        id
                        from
                        toChainId
                        timestamp
                    }
                }
              `)
            });
            resolve(data.data.fundsDepositeds[0]);
        } catch(error) {
            reject(error);
        }
    });
}

let getTransferData = (depositHash) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await ethereumGraphClient.query({
                query: gql(`
                query {
                    fundsSentToUsers(where: {depositHash: "${depositHash}"}) {
                        id
                        tokenAddress
                        amount
                        receiver
                        lpFee
                        timestamp
                        feeEarned
                        gasPrice
                        depositHash
                        transferredAmount
                    }
                }
              `)
            });
            resolve(data.data.fundsSentToUsers[0]);
        } catch(error) {
            reject(error);
        }
    })
}
function App() {
    const classes = useStyles();
    const [transferData, setTransferData] = useState([]);
    const [depositHash, setDepositHash] = useState("");

    let searchDepositHash = async () => {
        let response = {}
        let depositData = await getDepositData(depositHash);
        response.depositTimestamp = depositData.timestamp
        response.sender = depositData.from

        let transferData = await getTransferData(depositHash);
        response.amountTransferred = transferData.amount
        response.exitHash = transferData.id
        response.depositHash = transferData.depositHash
        response.tokenAddress = transferData.tokenAddress
        response.amountReceived = transferData.transferredAmount
        response.receiver = transferData.receiver
        response.LpFeePer = transferData.lpFee
        response.feeEarned = transferData.feeEarned
        response.exitTimestamp = transferData.timestamp
        response.gasPrice = transferData.gasPrice
                    
        setTransferData(response);
    }

    let printDate = (epochTime) => {
        let d = new Date(epochTime*1000);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    }

    const onHashChange = event => {
        setDepositHash(event.target.value);
    };

    return (
        <div className="App">
             <input
                type="text"
                placeholder="Enter your quote"
                onChange={onHashChange}
                value={depositHash}
            />
            <Button variant="contained" color="primary" onClick={searchDepositHash} style={{ marginLeft: "10px" }}>
                Submit
            </Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                {transferData.length !== 0 && 
                    <TableHead>
                    <TableRow>
                        <TableCell align="left" className="title">Deposit Hash</TableCell>
                        <TableCell align="left">{transferData.depositHash}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Amount Transferred</TableCell>
                        <TableCell align="left">{(transferData.amountTransferred)/Math.pow(10,config.tokenInfo[transferData.tokenAddress].decimal)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Deposit Time</TableCell>
                        <TableCell align="left">{printDate(transferData.depositTimestamp)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Sender</TableCell>
                        <TableCell align="left">{transferData.sender}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Exit Hash</TableCell>
                        <TableCell align="left">{transferData.exitHash}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Token</TableCell>
                        <TableCell align="left">{config.tokenInfo[transferData.tokenAddress].name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Amount Recieved</TableCell>
                        <TableCell align="left">{(transferData.amountReceived/Math.pow(10,config.tokenInfo[transferData.tokenAddress].decimal))}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Transfer GasPrice</TableCell>
                        <TableCell align="left">{transferData.gasPrice/1000000000}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Receiver</TableCell>
                        <TableCell align="left">{transferData.receiver}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Admin Fee</TableCell>
                        <TableCell align="left">{transferData.LpFeePer/100} %</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Exit Time</TableCell>
                        <TableCell align="left">{printDate(transferData.exitTimestamp)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Fee Earned</TableCell>
                        <TableCell align="left">{(transferData.feeEarned)/Math.pow(10,config.tokenInfo[transferData.tokenAddress].decimal)}</TableCell>
                    </TableRow>
                    </TableHead>
                }
                </Table>
            </TableContainer>
            
        </div>
    );
}

export default App;