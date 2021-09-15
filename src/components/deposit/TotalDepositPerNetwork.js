import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from  'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { getTotalDepositPerNetwork } from '../../service/deposit';
import { config } from '../../config';
import CounterPerNetwork from '../basic/CounterPerNetwork';
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
  valueRow: {
    fontSize: "20px"
  },
  footer: {
      textAlign: "center",
      padding: "2px",
      fontWeight: "bold"
  },
  logoIcon: {
      width: "15px",
      margin: "0px 5px"
  }
});

export default function TotalDepositPerNetwork(props) {
    const classes = useStyles();

    const [totalDeposit, setTotalDeposit] = useState("");
    const [networkName, setNetworkName] = useState("");
    const [label, setLabel] = useState();
    const version = useSelector(state => state.root.version);

    useEffect(()=>{
        setTotalDeposit("");
        let chainId = props.chainId;

        if(chainId) {
            fetchTotalDeposit(chainId);
            
            let networkInfo = config.chainIdMap[chainId];
            if(networkInfo) {
                setNetworkName(networkInfo.name);
            }
        }
    }, [version]);

    let fetchTotalDeposit = async (chainId) => {
        try {
            let _totalDeposit = await getTotalDepositPerNetwork(chainId, version);
            if(_totalDeposit != undefined) {
                // Format Data here
                setTotalDeposit(_totalDeposit);
                _totalDeposit = numeral(_totalDeposit).format('$ 0.00a');
                setLabel(_totalDeposit);
            }
        } catch(error) {
            console.error(error);
            setTotalDeposit("Error");
        }
    }

    return (
        <CounterPerNetwork 
            title={props.title}
            counter={totalDeposit}
            label={label}
            chainId={props.chainId} />
    )
}