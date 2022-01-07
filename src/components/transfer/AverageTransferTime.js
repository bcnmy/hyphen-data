import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux'
import clsx from  'clsx';
import Counter from '../basic/Counter';
import { getDepositTransactions } from '../../service/deposit';
import { getTransferTransaction } from '../../service/transfer';
import { quantile } from '../../service/utils';
import { config } from '../../config';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
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
    const [averageTimeArray, setAverageTimeArray] = useState([]);

    const [selectedFromChain, setSelectedFromChain] = useState();
    const [selectedToChain, setSelectedToChain] = useState();

    const [sourceChains, setSourceChains] = useState(config.supportedChainsArray);
    const [destinationChains, setDestinationChains] = useState();

    const version = useSelector(state => state.root.version);

    // Set the selected from chain and we get all the source chains
    useEffect(()=>{
        if(sourceChains && sourceChains.length > 0) {
            if(config.chainIdMap && config.chainIdMap[props.fromChainId]) {
                setSelectedFromChain(config.chainIdMap[props.fromChainId]);
            } else {
                setSelectedFromChain(sourceChains[0]);
            }
        }
    }, [sourceChains]);

    // Set the allowed destination chains, when selectedFromChain is set
    useEffect(()=>{
        if(selectedFromChain) {
            let allowedDestinationChains = [];
            for(let index in sourceChains) {
                let chain = sourceChains[index];
                if(chain.chainId != selectedFromChain.chainId) {
                    allowedDestinationChains.push(sourceChains[index]);
                }
            }
            setDestinationChains(allowedDestinationChains);
            if(allowedDestinationChains && allowedDestinationChains.length > 0) {
                if(selectedToChain && allowedDestinationChains.indexOf(selectedToChain) < 0) {
                    setSelectedToChain(allowedDestinationChains[0]);
                } else if(!selectedToChain && props.toChainId != undefined) {
                    setSelectedToChain(config.chainIdMap[props.toChainId]);
                }
            }
        }
    }, [selectedFromChain]);

    useEffect(()=>{
        if(selectedFromChain && selectedToChain) {
            fetchAverageTransferTime(selectedFromChain.chainId, selectedToChain.chainId, 30);
        }
    }, [selectedFromChain, selectedToChain]);

    useEffect(()=>{
        if(averageTimeArray && averageTimeArray.length > 0) {
            let q90 = quantile(averageTimeArray, .90);
            setAverageTime(ms(q90, {long: true}));
        }
    }, [averageTimeArray]);

    const fetchAverageTransferTime = async (fromChainId, toChainId, numOfTransactions) => {
        setAverageTimeArray([]);
        setAverageTime(". . .");
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

    const onFromChainChanged = async (event) => {
        const _chainId = event.target.value;
        if(_chainId) {
            setSelectedFromChain(config.chainIdMap[_chainId]);
        }
    }

    const onToChainChanged = async (event) => {
        const _chainId = event.target.value;
        if(_chainId) {
            setSelectedToChain(config.chainIdMap[_chainId]);
        }
    }

    let swapChains = ()=>{
        // setAverageTime("...");
        // setAverageTimeArray([]);
        // let _fromChainId = toChainId;
        // let _toChainId = fromChainId;
        // setFromChainId(_fromChainId);
        // setToChainId(_toChainId);
    }

    let label = <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    }}>
        <div>{averageTime}</div>
        <div className={classes.chainInfoContainer}>

            {sourceChains && selectedFromChain &&
                <FormControl variant="outlined" className={classes.chainName} size="small">
                    <Select
                        className={classes.chainName}
                        value={selectedFromChain.chainId}
                        onChange={onFromChainChanged}
                        inputProps={{
                            name: 'version',
                            id: 'simple-select-outlined',
                        }}>
                        {sourceChains.map((item, index) => {
                            return <MenuItem value={item.chainId} key={`ChainItem_${index}`}>{item.name}</MenuItem>;
                        })}
                    </Select>
                </FormControl>
            }
            {/* <div className={classes.chainName}>
                <img className={classes.logoIcon} src={config.chainLogoMap[fromChainId]}/>
                {config.chainIdMap[fromChainId].name}
            </div> */}

            <img src={Arrow} className={clsx(classes.logoIcon, classes.swapIcon)} onClick={swapChains}/>

            {destinationChains && selectedToChain &&
                <FormControl variant="outlined" className={classes.chainName} size="small">
                    <Select
                        value={selectedToChain.chainId}
                        onChange={onToChainChanged}
                        inputProps={{
                            name: 'version',
                            id: 'simple-select-outlined',
                        }}>
                        {destinationChains.map((item, index) => {
                            return <MenuItem value={item.chainId} key={`ChainItem_${index}`}>{item.name}</MenuItem>;
                        })}
                    </Select>
                </FormControl>
            }
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