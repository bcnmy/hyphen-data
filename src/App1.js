import "./App.css";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
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

const APIURL = "https://api.thegraph.com/subgraphs/name/divyan73/lpmanagergoerli";
const number = 10;
const tokensQuery = `
  query {
    fundsSentToUsers (orderBy: timestamp, orderDirection: desc, first: ${number}) {
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
`
const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache()
});

let getAssetsSent = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await client.query({
                query: gql(tokensQuery)
            });
            resolve(data.data);
            // console.log(data.data);
        } catch(error) {
            reject(error);
        }
    })
}

function App() {
    const classes = useStyles();
    const [assetSent, setAssetSent] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let response = await getAssetsSent();
            setAssetSent(response.fundsSentToUsers);
        }
        fetchData();
    }, []);

    let printDate = (epochTime) => {
        let d = new Date(epochTime*1000);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    }

    return (
        <div className="App">
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Deposit Hash</TableCell>
                            <TableCell align="center">Amount Transferred</TableCell>
                            <TableCell>Exit Hash</TableCell>
                            <TableCell align="center">Token Address</TableCell>
                            <TableCell align="center">Amount Recieved</TableCell>
                            <TableCell align="center">Transfer GasPrice</TableCell>
                            <TableCell align="center">Receiver</TableCell>
                            <TableCell align="center">Admin Fee</TableCell>
                            <TableCell align="center">Exit Time</TableCell>
                            <TableCell align="center">Fee Earned</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                    {assetSent.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell align="left">{(row.depositHash)}</TableCell>
                            <TableCell align="left">{row.amount/Math.pow(10,config.tokenInfo[row.tokenAddress].decimal)}</TableCell>
                            <TableCell align="left">{row.id}</TableCell>
                            <TableCell align="left">{config.tokenInfo[row.tokenAddress].name}</TableCell>
                            <TableCell align="left">{(row.transferredAmount/Math.pow(10,config.tokenInfo[row.tokenAddress].decimal))}</TableCell>
                            <TableCell align="center">{row.gasPrice/1000000000}</TableCell>
                            <TableCell align="left">{row.receiver}</TableCell>
                            <TableCell align="left">{row.lpFee/100} %</TableCell>
                            <TableCell align="left">{printDate(row.timestamp)}</TableCell>
                            <TableCell align="left">{row.feeEarned/Math.pow(10,config.tokenInfo[row.tokenAddress].decimal)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
        </div>
    );
}

export default App;