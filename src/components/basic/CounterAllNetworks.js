import { makeStyles } from '@material-ui/core/styles';
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

export default function CounterAllNetworks(props) {
    const classes = useStyles();

    const [chainInfo, setChainInfo] = useState(<div></div>);

    useEffect(()=>{
        let chainIds = props.chainIds;
        if(chainIds !== undefined && chainIds.length > 0) {
            let _chainInfo;
            if(chainIds.length == 1) {
                let chainId = chainIds[0];
                _chainInfo = <div className={classes.chainInfoContainer}>
                    <img className={classes.logoIcon} src={config.chainLogoMap[chainId]}/>
                    <div className={classes.chainName}>{config.chainIdMap[chainId].name}</div>
                </div>
            } else {
                _chainInfo = props.chainIds.map((item, index)=>
                    <img 
                        src={config.chainLogoMap[item]}
                        className={classes.logoIcon}
                        alt={config.chainIdMap[item].name}
                        key={`LogoIcon_${index}`}/>                    
                )
            }
            setChainInfo(_chainInfo);
        }
    }, [])

    return (
        <Counter {...props} chainInfo={chainInfo} />
    )
}