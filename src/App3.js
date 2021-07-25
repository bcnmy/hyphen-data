import React, { useState, useEffect } from "react";
import "./App.css";
import { ethers, BigNumber } from "ethers";
const { config } = require("./config");

// let lpManagerGoerli, lpManagerMumbai;
let goerliProvider, mumbaiProvider;
let erc20Goerli_USDC, erc20Goerli_USDT, erc20Goerli_DAI, erc20Mumbai_USDC, erc20Mumbai_USDT, erc20Mumbai_DAI;

function App() {

    const [goerliUsdc, setGoerliUsdc] = useState([]);
    const [goerliUsdt, setGoerliUsdt] = useState([]);
    const [goerliDai, setGoerliDai] = useState([]);

    const [mumbaiUsdc, setMumbaiUsdc] = useState([]);
    const [mumbaiUsdt, setMumbaiUsdt] = useState([]);
    const [mumbaiDai, setMumbaiDai] = useState([]);

    useEffect(() => {
        goerliProvider = new ethers.providers.JsonRpcProvider(config.goerliRpc);
        mumbaiProvider = new ethers.providers.JsonRpcProvider(config.mumbaiRpc);

        // lpManagerGoerli = new ethers.Contract(
        //     config.LP_MANAGER_ABI,
        //     config.contractAddress[5],
        //     goerliProvider
        // );
        // lpManagerMumbai = new ethers.Contract(
        //     config.LP_MANAGER_ABI,
        //     config.contractAddress[80001],
        //     mumbaiProvider
        // );

        erc20Goerli_USDC = new ethers.Contract(
            config.supportedToken[5]["USDC"],
            config.ERC20_ABI,
            goerliProvider
        );

        erc20Goerli_USDT = new ethers.Contract(
            config.supportedToken[5]["USDT"],
            config.ERC20_ABI,
            goerliProvider
        );
        erc20Goerli_DAI = new ethers.Contract(
            config.supportedToken[5]["DAI"],
            config.ERC20_ABI,
            goerliProvider
        );

        
        erc20Mumbai_USDC = new ethers.Contract(
            config.supportedToken[80001]["USDC"],
            config.ERC20_ABI,
            mumbaiProvider
        );
        erc20Mumbai_USDT = new ethers.Contract(
            config.supportedToken[80001]["USDT"],
            config.ERC20_ABI,
            mumbaiProvider
        );
        erc20Mumbai_DAI = new ethers.Contract(
            config.supportedToken[80001]["DAI"],
            config.ERC20_ABI,
            mumbaiProvider
        );

        getUSDCBalance(5);
        getUSDTBalance(5);
        getDAIBalance(5);

        getUSDCBalance(80001);
        getUSDTBalance(80001);
        getDAIBalance(80001);
    }, []);

    let getUSDCBalance = async(networkId) => {
        if(networkId === 5 && erc20Goerli_USDC){
            let result = await erc20Goerli_USDC.balanceOf(config.contractAddress[networkId]);
            if (result) {
                console.log(result.toString()/BigNumber.from(10).pow(config.tokenInfo[config.supportedToken[networkId]["USDC"]].decimal).toString());
            } else {
                console.log("error")
            }
            setGoerliUsdc(result.toString()/BigNumber.from(10).pow(config.tokenInfo[config.supportedToken[networkId]["USDC"]].decimal).toString());
        }

        if(networkId === 80001 && erc20Mumbai_USDC){
            let result = await erc20Mumbai_USDC.balanceOf(config.contractAddress[networkId]);
            if (result) {
                console.log(config.supportedToken[networkId]["USDC"])
                console.log(config.tokenInfo[config.supportedToken[networkId]["USDC"]].decimal);
                console.log(result.toString()/BigNumber.from(10).pow(config.tokenInfo[config.supportedToken[networkId]["USDC"]].decimal).toString());
            } else {
                console.log("error")
            }
            setMumbaiUsdc(result.toString()/BigNumber.from(10).pow(config.tokenInfo[config.supportedToken[networkId]["USDC"]].decimal).toString());
        }
    }

    let getUSDTBalance = async(networkId) => {
        if(networkId === 5 && erc20Goerli_USDT){
            let result = await erc20Goerli_USDT.balanceOf(config.contractAddress[networkId]);
            if (result) {
                console.log(result.toString()/BigNumber.from(10).pow(config.tokenInfo[config.supportedToken[networkId]["USDT"]].decimal).toString());
            } else {
                console.log("error")
            }
            setGoerliUsdt(result.toString()/BigNumber.from(10).pow(config.tokenInfo[config.supportedToken[networkId]["USDT"]].decimal).toString());
        }
        if(networkId === 80001 && erc20Mumbai_USDT){
            let result = await erc20Mumbai_USDT.balanceOf(config.contractAddress[networkId]);
            if (result) {
                console.log(result.toString()/BigNumber.from(10).pow(config.tokenInfo[config.supportedToken[networkId]["USDT"]].decimal).toString());
            } else {
                console.log("error")
            }
            setMumbaiUsdt(result.toString()/BigNumber.from(10).pow(config.tokenInfo[config.supportedToken[networkId]["USDT"]].decimal).toString());
        }
    }

    let getDAIBalance = async(networkId) => {
        if(networkId === 5 && erc20Goerli_DAI){
            let result = await erc20Goerli_DAI.balanceOf(config.contractAddress[networkId]);
            if (result) {
                console.log(result.toString()/BigNumber.from(10).pow(config.tokenInfo[config.supportedToken[networkId]["DAI"]].decimal).toString());
            } else {
                console.log("error")
            }
            setGoerliDai(result.toString()/BigNumber.from(10).pow(config.tokenInfo[config.supportedToken[networkId]["DAI"]].decimal).toString());
        }

        if(networkId === 80001 && erc20Mumbai_DAI){
            let result = await erc20Mumbai_DAI.balanceOf(config.contractAddress[networkId]);
            if (result) {
                console.log(result.toString()/BigNumber.from(10).pow(config.tokenInfo[config.supportedToken[networkId]["DAI"]].decimal).toString());
            } else {
                console.log("error")
            }
            setMumbaiDai(result.toString()/BigNumber.from(10).pow(config.tokenInfo[config.supportedToken[networkId]["DAI"]].decimal).toString());
        }
    }

    return (
        <div className="App">
            <div> Available Liquidity </div>
            <br/>

            <div><u>Goerli</u></div> 
            <div>USDC: {goerliUsdc}</div>
            <div>USDT: {goerliUsdt}</div>
            <div>DAI: {goerliDai}</div>
            <br/>
            <div><u>Mumbai</u></div> 
            <div>USDC: {mumbaiUsdc}</div>
            <div>USDT: {mumbaiUsdt}</div>
            <div>DAI: {mumbaiDai}</div>
        </div>
  );
}

export default App;