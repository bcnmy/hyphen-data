import { makeStyles } from '@material-ui/core/styles';
import clsx from  'clsx';
import { useEffect, useState } from 'react';
import { config } from '../../config';
import Counter from './Counter';

const useStyles = makeStyles({
  logoIcon: {
      width: "24px",
      margin: "0px 5px"
  },
  chainInfoContainer: {
      display: "flex",
      flexDirection: "row"
  }
});

export default function CounterPerNetwork(props) {
    const classes = useStyles();

    const [chainInfo, setChainInfo] = useState(<div></div>);

    useEffect(()=>{
        let chainId = props.chainId;
        if(chainId != undefined) {
            let _chainInfo = <div className={classes.chainInfoContainer}>
                <img className={classes.logoIcon} src={config.chainLogoMap[chainId]}/>
                <div className={classes.chainName}>{config.chainIdMap[chainId].name}</div>
            </div>
            setChainInfo(_chainInfo);
        }
    }, [])

    return (
        <Counter {...props} chainInfo={chainInfo} />
    )
}