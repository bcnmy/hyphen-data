import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from  'clsx';
import { getTotalDeposit } from '../../service/deposit';
import { config } from '../../config';
import { useSelector, useDispatch } from 'react-redux';
let numeral = require('numeral'); //http://numeraljs.com/

const useStyles = makeStyles({
  root: {
      padding: "5px",
      width: "200px"
  },
  container: {
      background: "#442387",
      border: "2px solid #454344",
      borderRadius: "5px",
      display: "flex",
      flexDirection: "column"
  },
  row: {
      padding: "5px 10px",
      textAlign: "center",
      color: "#ffddaa"
  },
  labelRow: {
      background: "#224455",
      color: "#ffddaa"
  },
  footer: {
      textAlign: "center",
      padding: "2px"
  }
});

export default function TotalDepositPerToken(props) {
    const classes = useStyles();

    const [totalDeposit, setTotalDeposit] = useState("");
    const [networkName, setNetworkName] = useState("");
    const version = useSelector(state => state.root.version);
    
    useEffect(()=>{
        setTotalDeposit("");
        let chainId = props.chainId;
        let tokenSymbol = props.tokenSymbol;

        if(chainId && tokenSymbol) {
            let tokenInfo = config.tokensMap[tokenSymbol][chainId];
            if(tokenInfo) {
                let tokenAddress = tokenInfo.address;
                fetchTotalDeposit(chainId, tokenAddress);
            }

            let networkInfo = config.chainIdMap[chainId];
            if(networkInfo) {
                setNetworkName(networkInfo.name);
            }
        }
    }, [version]);

    let fetchTotalDeposit = async (chainId, tokenAddress) => {
        try {
            let _totalDeposit = await getTotalDeposit(chainId, tokenAddress, version);
            if(_totalDeposit != undefined) {
                // Format Data here
                _totalDeposit = numeral(_totalDeposit).format('0.00a');
                setTotalDeposit(_totalDeposit);
            }
        } catch(error) {
            console.error(error);
            setTotalDeposit("Error");
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <div className={clsx(classes.row, classes.valueRow)}>
                    {totalDeposit}
                </div>
                <div className={clsx(classes.row, classes.labelRow)}>
                    {props.tokenSymbol}
                </div>
            </div>
            <div className={classes.footer}>
                {networkName}
            </div>
        </div>
    )
}