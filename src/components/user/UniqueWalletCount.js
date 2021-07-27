import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from  'clsx';
import { getUniqueUserCount } from '../../service/users';
import { config } from '../../config';
import CounterAllNetworks from '../basic/CounterAllNetworks';
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

export default function UniqueWalletCount(props) {
    const classes = useStyles();

    const [uniqueWalletCount, setUniqueWalletCount] = useState("");

    useEffect(()=>{
        let chainIds = props.chainIds;

        if(chainIds) {
            fetchUniqueWalletCount(chainIds);
        }
    }, []);

    let fetchUniqueWalletCount = async (chainIds) => {
        try {
            let _totalDeposit = 0;
            for(let index = 0; index < chainIds.length; index++) {
                let item = chainIds[index];
                _totalDeposit += await getUniqueUserCount(item);
            }
            
            if(_totalDeposit != undefined) {
                setUniqueWalletCount(_totalDeposit);
            }
        } catch(error) {
            console.error(error);
            setUniqueWalletCount("Error");
        }
    }

    return (
        <CounterAllNetworks title={props.title} label={uniqueWalletCount} chainIds={props.chainIds}  {...props}/>
    )
}