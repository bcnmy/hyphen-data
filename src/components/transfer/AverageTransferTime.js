import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux'
import clsx from  'clsx';
import Counter from '../basic/Counter';
import { getDepositTransactions } from '../../service/deposit';
import { getTransferTransaction } from '../../service/transfer';
import { quantile } from '../../service/utils';
import { config } from '../../config';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import Arrow from "../../assets/arrow.svg";

const ms = require("ms");

const useStyles = makeStyles({
  root: {
    },
    logoIcon: {
        width: "24px",
        margin: "0px 6px"
    },
    chainInfoContainer: {
        display: "flex",
        flexDirection: "row",
        fontSize: "24px",
        alignItems: "center"
    },
    swapIcon: {
        cursor: "pointer",
        margin: "0px 10px"
    },
    chainName: {
        padding: "0px 5px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    }
});

export default function AverageTransferTime(props) {
    const classes = useStyles();

    const [averageTime, setAverageTime] = useState("...");
    const [fromChainId, setFromChainId] = useState(props.fromChainId);
    const [toChainId, setToChainId] = useState(props.toChainId);
    const [averageTimeArray, setAverageTimeArray] = useState([]);

    const version = useSelector(state => state.root.version);

    useEffect(()=>{
        if(fromChainId && toChainId) {
            fetchAverageTransferTime(fromChainId, toChainId, 30);
        }    
    }, [fromChainId, toChainId]);

    useEffect(()=>{
        if(averageTimeArray && averageTimeArray.length > 0) {
            let q95 = quantile(averageTimeArray, .95);
            setAverageTime(ms(q95, {long: true}));
        }
    }, [averageTimeArray]);

    const fetchAverageTransferTime = async (fromChainId, toChainId, numOfTransactions) => {
        let depositTransactions = await getDepositTransactions(fromChainId, toChainId, version, numOfTransactions);
        if(depositTransactions && depositTransactions.length > 0) {
            for(let index=0; index<depositTransactions.length; index++) {
                (async (depositTransaction)=>{
                    let startTime = parseInt(depositTransaction.timestamp);
                    let transferData = await getTransferTransaction(toChainId, depositTransaction.id, version);
                    if(transferData) {
                        let endTime = parseInt(transferData.timestamp);
                        let timeDiff = parseInt(endTime - startTime)*1000;
                        setAverageTimeArray(oldArray => [...oldArray, timeDiff]);
                    }
                })(depositTransactions[index]);
            }
        }   
    }

    let swapChains = ()=>{
        setAverageTime("...");
        setAverageTimeArray([]);
        let _fromChainId = toChainId;
        let _toChainId = fromChainId;
        setFromChainId(_fromChainId);
        setToChainId(_toChainId);
    }

    let chainInfo = <div className={classes.chainInfoContainer}>
        <img className={classes.logoIcon} src={config.chainLogoMap[fromChainId]}/>
        <SwapHorizIcon className={clsx(classes.logoIcon, classes.swapIcon)} onClick={swapChains}/>
        <img className={classes.logoIcon} src={config.chainLogoMap[toChainId]}/>
    </div>

    let label = <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    }}>
        <div>{averageTime}</div>
        <div className={classes.chainInfoContainer}>
            <div className={classes.chainName}>
                <img className={classes.logoIcon} src={config.chainLogoMap[fromChainId]}/>
                {config.chainIdMap[fromChainId].name}
            </div>
            
            <img src={Arrow} className={clsx(classes.logoIcon, classes.swapIcon)} onClick={swapChains}/>
            
            <div className={classes.chainName}>
                <img className={classes.logoIcon} src={config.chainLogoMap[toChainId]}/>
                {config.chainIdMap[toChainId].name}
            </div>
        </div>
    </div>;
    return (
        <div className={classes.root}>
            <Counter title="Average Transfer Time" label={label} {...props} labelContainerStyle={{
                padding: "14px 20px"
            }}/>
        </div>
    )
}