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
        asset
        amount
        target
        LpFee
        timestamp
        FeeEarned
        input
        gasPrice
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

    useEffect(async ()=>{
        let response = await getAssetsSent();
        setAssetSent(response.fundsSentToUsers);
    }, []);

    let printDate = (epochTime) => {
        let d = new Date(epochTime*1000);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    }

    let decodeInput = (input) => { 
        let decodedData = abiDecoder.decodeMethod(input);
        console.log(decodedData.params);
        return decodedData.params;
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
                        <TableCell component="th" scope="row">
                            {(decodeInput(row.input)[3].value)}
                        </TableCell>
                        <TableCell align="left">{(decodeInput(row.input)[1].value)/Math.pow(10,config.tokenInfo[row.asset].decimal)}</TableCell>
                        <TableCell align="left">{row.id}</TableCell>
                        <TableCell align="left">{config.tokenInfo[row.asset].name}</TableCell>
                        <TableCell align="left">{(row.amount/Math.pow(10,config.tokenInfo[row.asset].decimal))}</TableCell>
                        <TableCell align="center">{row.gasPrice/1000000000}</TableCell>
                        <TableCell align="left">{row.target}</TableCell>
                        <TableCell align="left">{row.LpFee/100} %</TableCell>
                        <TableCell align="left">{printDate(row.timestamp)}</TableCell>
                        {/* {console.log(row.FeeEarned/Math.pow(10,18))} */}
                        <TableCell align="left">{(decodeInput(row.input)[1].value * (row.LpFee/10000))/Math.pow(10,config.tokenInfo[row.asset].decimal)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
        </div>
    );
}

export default App;