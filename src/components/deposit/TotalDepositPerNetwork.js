import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from  'clsx';
import { getTotalDepositPerNetwork } from '../../service/deposit';
import { config } from '../../config';
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
      width: "12px",
      margin: "0px 5px"
  }
});

export default function TotalDepositPerToken(props) {
    const classes = useStyles();

    const [totalDeposit, setTotalDeposit] = useState("");
    const [networkName, setNetworkName] = useState("");

    useEffect(()=>{
        let chainId = props.chainId;

        if(chainId) {
            fetchTotalDeposit(chainId);
            
            let networkInfo = config.chainIdMap[chainId];
            if(networkInfo) {
                setNetworkName(networkInfo.name);
            }
        }
    }, []);

    let fetchTotalDeposit = async (chainId) => {
        try {
            let _totalDeposit = await getTotalDepositPerNetwork(chainId);
            if(_totalDeposit != undefined) {
                // Format Data here
                _totalDeposit = numeral(_totalDeposit).format('$ 0.00a');
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
            </div>

            {props.chainId && 
            <div className={classes.footer}>
                {/* <img 
                    src={config.chainLogoMap[props.chainId]}
                    alt={networkName}
                    className={classes.logoIcon}/> */}
                {networkName}
            </div>
            }
        </div>
    )
}