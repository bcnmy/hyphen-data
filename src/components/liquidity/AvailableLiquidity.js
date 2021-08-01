import { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from  'clsx';
import { config } from '../../config';
import { getBalance, getLiquidityAdded } from '../../service/token';
import {
    Chart,
    BarSeries,
    ArgumentAxis,
    ValueAxis,
    Legend,
    Title,
    Tooltip
  } from '@devexpress/dx-react-chart-material-ui';
import { Animation, EventTracker, HoverState, Stack } from '@devexpress/dx-react-chart';

const useStyles = makeStyles({
    root: {
        padding: "5px",
        margin: "30px 5px",
        width: "680px",
        height: "310px!important",
        border: "2px solid #615CCD",
        borderRadius: "5px"
    }
});


const styles = {
    titleText: {
        textAlign: 'left',
        padding: "0px 5px 10px 5px",
        fontSize: "20px"
    }
};

const TextComponent = withStyles(styles)(({ classes, ...restProps }) => (
    <Title.Text {...restProps} className={classes.titleText} />
));

export default function AvailableLiquidity(props) {
    const classes = useStyles();

    const [error, setError] = useState();
    const [liquidityData, setLiquidityData] = useState([]);

    useEffect(()=>{
        let chainId = props.chainId;
        if(chainId) {
            fetchAvailableLiquidity(chainId);
        } else {
            setError("No chainId passed to component");
        }
    }, []);

    const fetchAvailableLiquidity = async (chainId) => {
        try {
            let supportedTokens = config.supportedTokenSymbols;
            let _liquidityData = [];
            for(let index = 0; index < supportedTokens.length; index++) {
                let tokenSymbol = supportedTokens[index];
                let tokenInfo = config.tokensMap[tokenSymbol][chainId];
                if(tokenInfo) {
                    let tokenAddress = tokenInfo.address;
                    let tokenBalance = await getBalance(tokenAddress, chainId, config.chainIdMap[chainId].LPManagerAddress);
                    let liquidityAdded = await getLiquidityAdded(tokenAddress, chainId, config.chainIdMap[chainId].LPManagerAddress);
                    if(tokenBalance != undefined) {
                        tokenBalance = parseFloat(tokenBalance);
                        _liquidityData.push({tokenSymbol, liquidity: tokenBalance, totalLiquidity: parseFloat(liquidityAdded)});
                        setLiquidityData([..._liquidityData, {tokenSymbol, liquidity: tokenBalance}]);
                    }
                } else {
                    console.info(`Token ${tokenSymbol} is not supported`);
                }
            }
        } catch(error) {
            console.log(error);
        }
    }
    return (
        <div className={classes.root}>
            {liquidityData && liquidityData.length > 0 &&
                <Chart data={liquidityData} height="300" >

                    <ValueAxis />
                    <ArgumentAxis />

                    <BarSeries
                        valueField="liquidity"
                        argumentField="tokenSymbol"
                        name="Available"
                        color={config.chainIdMap[props.chainId].color}
                    />
                    <BarSeries
                        valueField="totalLiquidity"
                        argumentField="tokenSymbol"
                        name="Total"
                    />
                    <Legend 
                        verticalAlignment="bottom"
                        />

                    <Stack />       
                    <Animation />
                    <Title text={`Available Liquidity (${config.chainIdMap[props.chainId].name})`} textComponent={TextComponent}/>
                    <EventTracker />
                    <HoverState />
                    <Tooltip />
                </Chart>
            }
            {(!liquidityData || liquidityData.length==0) &&
                <div> {error} </div>
            }
        </div>
    )
}