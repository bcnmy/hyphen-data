import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CardContent, Card } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import clsx from  'clsx';
import { useSelector, useDispatch } from 'react-redux'
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EmptySearchState from '../../assets/empty-search.svg'
import Paper from '@material-ui/core/Paper';
import { getDepositData } from '../../service/deposit';
import { getTransferData } from '../../service/transfer';
import { config } from '../../config';
import { updateSearchState } from '../../redux';
const ms = require("ms");

const useStyles = makeStyles({
  root: {
      padding: "10px 40px"
  },
  headingContainer: {
      fontSize: "1.3125rem",
      padding: "0px 0px 10px 5px",
      fontWeight: "bold"
  },
  transferTime: {
    padding: "5px 10px",
    backgroundColor: "rgba(119,131,143,.1)",
    borderRadius: ".35rem",
    width: "fit-content"
  },
  detailsRow: {
      padding: "5px 10px",
      borderBottom: "1px solid #e7eaf3",
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
  },
  detailsRowKey: {
    padding: "10px 10px",
    width: "300px"    
  },
  detailsRowValue: {
    padding: "10px 10px"
  },
  hashNotFound: {
      display: "flex",
      flexDirection: "column",
      padding: "30px 40px",
      justifyContent: "center",
      alignItems: "center",
      color: "#6c757e",
      fontSize: "20px"
  },
  notFoundLogo: {
      padding: "20px",
      width: "200px"
  },
  tokenIcon: {
      width: "14px",
      margin: "0px 2px"
  },
  amountContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  tableHeading: {
      fontSize: "18px"
  },
  transferDetailsContainer: {
      margin: "0px 0px 30px 0px"
  },
  note: {
      textAlign: "center",
      fontSize: "15px",
      color: "#444",
      marginTop: "30px"      
  }
});

export default function TransferDetails(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    let networkId = useSelector(state => state.search.networkId);
    let searchText = useSelector(state => state.search.searchText);
    
    const [notFoundText, setNotFoundText] = useState("Fetching data ...");
    const [transferData, setTransferData] = useState();
    const [depositData, setDepositData] = useState();
    const [transferTime, setTransferTime] = useState();

    let fetchTransferDetails = async (_networkId, _searchText) => {
        setTransferData();
        setDepositData();
        let depositData = await getDepositData(_networkId, _searchText);
        if(depositData) {
            let tokenInfo = config.tokenAddressMap[depositData.tokenAddress.toLowerCase()][_networkId];
            if(tokenInfo) {
                depositData.tokenSymbol = tokenInfo.symbol;
            }
            setDepositData(depositData);

            let transferData = await getTransferData(depositData.toChainId, _searchText);
            if(transferData) {
                let tokenInfo = config.tokenAddressMap[transferData.tokenAddress][depositData.toChainId];
                if(tokenInfo) {
                    transferData.tokenSymbol = tokenInfo.symbol;
                }
                setTransferData(transferData);

                let startTime = parseInt(depositData.timestamp);
                let endTime = parseInt(transferData.timestamp);
                if(startTime && endTime) {
                    let timeForTransfer = ms((endTime - startTime)*1000, { long: true })
                    setTransferTime(timeForTransfer);
                }
            } else {
                setNotFoundText(`No transfer transaction found on ${config.chainIdMap[depositData.toChainId].name} yet.`)
            }
        } else {
            setTransferData();
            setDepositData();
            setNotFoundText(`No deposit data found for hash ${searchText}`)
        }           
    }

    useEffect(()=>{
        if(networkId && searchText) {
            fetchTransferDetails(networkId, searchText);
            dispatch(updateSearchState({searchText: ""}));
        }
    }, [searchText]);

    let printDate = (epochTime) => {
        let d = new Date(epochTime*1000);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString() + " +UTC";
    }

    return (
        <div className={classes.root}>
            <div className={classes.rootContainer}>
                <div className={classes.headingContainer}>
                    Transfer Details
                </div>
                <Card className={classes.detailsContainer}>
                    <CardContent>
                    {depositData  && 
                        <div className={classes.transferDetailsContainer}>
                            <div className={classes.tableHeading}>
                                Deposit on {config.chainIdMap[networkId].name}
                            </div>
                            <TableContainer>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="left" className={classes.detailsRowKey}>
                                                Token:
                                            </TableCell>
                                            <TableCell align="left" className={classes.detailsRowValue}>
                                                <img className={classes.tokenIcon} 
                                                    src={config.tokenLogoMap[depositData.tokenSymbol]} 
                                                    alt={depositData.tokenSymbol}/>
                                                {` ${depositData.tokenSymbol} `}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left" className={classes.detailsRowKey}>
                                                Deposit Hash:
                                            </TableCell>
                                            <TableCell align="left" className={classes.detailsRowValue}>
                                                {depositData.id}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left" className={classes.detailsRowKey}>
                                                Amount Transferred:
                                            </TableCell>
                                            <TableCell align="left" className={classes.detailsRowValue}>
                                                {depositData && 
                                                    <div className={classes.amountContainer}>
                                                        {` ${depositData.formattedAmount} `} 
                                                        {` ${depositData.tokenSymbol} `}
                                                        ({`$${depositData.formattedAmountUSD}`})
                                                    </div>
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left" className={classes.detailsRowKey}>
                                                Deposit Time:
                                            </TableCell>
                                            <TableCell align="left" className={classes.detailsRowValue}>
                                                {printDate(depositData.timestamp)}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left" className={classes.detailsRowKey}>
                                                From:
                                            </TableCell>
                                            <TableCell align="left" className={classes.detailsRowValue}>
                                                {depositData.from}
                                            </TableCell>
                                        </TableRow>

                                        </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    }
                    {transferData && depositData &&
                    <div>
                        <div className={classes.tableHeading}>
                            Transfer on {config.chainIdMap[depositData.toChainId].name}
                        </div>
                        <TableContainer>
                            <Table className={classes.table} aria-label="simple table">
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="left" className={classes.detailsRowKey}>
                                            Token:
                                        </TableCell>
                                        <TableCell align="left" className={classes.detailsRowValue}>
                                            <img className={classes.tokenIcon} 
                                                src={config.tokenLogoMap[transferData.tokenSymbol]} 
                                                alt={transferData.tokenSymbol}/>
                                            {` ${transferData.tokenSymbol} `}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" className={classes.detailsRowKey}>
                                            Transfer Duration:
                                        </TableCell>
                                        <TableCell align="left" className={classes.detailsRowValue}>
                                            <div className={classes.transferTime}>
                                                {transferTime}
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align="left" className={classes.detailsRowKey}>
                                            Transfer Hash:
                                        </TableCell>
                                        <TableCell align="left" className={classes.detailsRowValue}>
                                            {transferData.id}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" className={classes.detailsRowKey}>
                                            Amount Received:
                                        </TableCell>
                                        <TableCell align="left" className={classes.detailsRowValue}>
                                            
                                            <div className={classes.amountContainer}>
                                                
                                                {` ${transferData.formattedAmount} `} 
                                                {` ${transferData.tokenSymbol} `}
                                                ({`$${transferData.formattedAmountUSD}`})
                                            </div>
                                        
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" className={classes.detailsRowKey}>
                                            Receiver:
                                        </TableCell>
                                        <TableCell align="left" className={classes.detailsRowValue}>
                                            {transferData.receiver}
                                        </TableCell>
                                    </TableRow>
                                    
                                    <TableRow>
                                        <TableCell align="left" className={classes.detailsRowKey}>
                                            Exit Time:
                                        </TableCell>
                                        <TableCell align="left" className={classes.detailsRowValue}>
                                            {printDate(transferData.timestamp)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" className={classes.detailsRowKey}>
                                            LP Fee:
                                        </TableCell>
                                        <TableCell align="left" className={classes.detailsRowValue}>
                                            <div className={classes.amountContainer}>
                                                
                                                {` ${transferData.formattedFeeEarned} `} 
                                                {` ${transferData.tokenSymbol} `}
                                                ({`$${transferData.formattedFeeEarnedUSD}`})
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    }

                    {!transferData &&                         
                        <div className={classes.hashNotFound}>
                            <img src={EmptySearchState} alt="Not found" className={classes.notFoundLogo}/>
                            <div>{notFoundText}</div>
                            <div className={classes.note}>
                                Note: Data might take some time to reflect as its fetched from TheGraph
                            </div>
                        </div>
                    }
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}