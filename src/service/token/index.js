import { BigNumber, ethers } from "ethers";
import { config } from "../../config";
import { getProvider } from "../provider";

let LPManagerContractMap = {};
let tokenContractPerChain = {};

function getFormattedValue({rawValue, chainId, tokenSymbol, tokenAddress, decimalPlace = 8}) {
    if(rawValue == undefined || !chainId) {
        throw new Error(`Invalid rawValue: ${rawValue} or chainId: ${chainId}`);
    }
    let tokenInfo;
    if(tokenSymbol) {
        tokenInfo = config.tokensMap[tokenSymbol][chainId];
    }
    if(!tokenInfo && tokenAddress) {
        tokenInfo = config.tokenAddressMap[tokenAddress.toLowerCase()][chainId];
    }
    let formattedValue = rawValue;
    if(tokenInfo && tokenInfo.decimal) {
        formattedValue = rawValue / BigNumber.from(10).pow(tokenInfo.decimal).toString();
        if (formattedValue != undefined) formattedValue = formattedValue.toFixed(decimalPlace);
    }
    console.log(`${tokenAddress} formattedValue : ${formattedValue}`);
    return formattedValue;
}

function getDollarValue(amount, tokenAddress) {
    if(tokenAddress && isEthereumAddress(tokenAddress)){
        return amount*4100
    } else if (tokenAddress && isBicoAddress(tokenAddress)) {
        return amount*2
    }
    return amount;
}

function isBicoAddress(tokenAddress) {
    const bicoDetails = config.tokensMap.BICO;
    for (let chainId in bicoDetails) {
        if (bicoDetails[chainId].address.toLowerCase() === tokenAddress.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function isEthereumAddress(tokenAddress) {
    let result = false;
    let ethDetails = config.tokensMap["ETH"];
    if(ethDetails && tokenAddress) {
        for(let key in ethDetails) {
            let details = ethDetails[key];
            if(details.address && tokenAddress.toLowerCase() === details.address.toLowerCase()) {
                result = true;
                break;
            }
        }
    }
    return result;
}

function getPoolInfo(tokenAddress, chainId, toChainId) {
    return new Promise(async (resolve, reject) => {
        if(!tokenAddress || !chainId) {
            return reject("Invalid params passed. tokenAddress or chainId is invalid. Please check params");
        }

        let info;
        let LPManager = LPManagerContractMap[chainId];
        if(!LPManager) {
            console.log("LP Manager not found. Creating a new instance");
            const fetchOptions = {
                method: "GET",
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                }
            }
            let poolInfo = await fetch(`${config.hyphen.baseURL}${config.hyphen.getPoolInfoPath}?tokenAddress=${tokenAddress}&fromChainId=${chainId}&toChainId=${toChainId}`, fetchOptions);
            if(poolInfo) {
                info = await poolInfo.json();
            }
            resolve(info);
        }
    });
}

function getBalance(tokenAddress, chainId, holder) {
    return new Promise(async (resolve, reject) => {
        if(!tokenAddress || !chainId || !holder) {
            return reject("Invalid input to getBalance method. tokenAddress, chainId and holder should be valid inputs");
        }
        let balance;
        let tokensMap = tokenContractPerChain[chainId];
        let tokenContract;
        if(tokensMap) {
            tokenContract = tokensMap[tokenAddress];
        }

        let provider = await getProvider(chainId);
        if(tokenAddress == config.NATIVE_TOKEN_ADDRESS){
            balance = await provider.getBalance(holder);
            console.log(`Native balance: ${balance}`);
        }

        else {
            if(!tokenContract) {
                tokenContract = new ethers.Contract(tokenAddress, config.ERC20_ABI, provider);
            }
            balance = await tokenContract.balanceOf(holder);
        }

        if(balance) {
            balance = getFormattedValue({rawValue: balance, chainId: chainId, tokenAddress: tokenAddress});
        }
        return resolve(balance);
    });
}

function getLiquidityAdded(tokenAddress, chainId, LPManagerAddress) {
    return new Promise(async (resolve, reject) => {
        if(!tokenAddress || !chainId || !LPManagerAddress) {
            return reject("Invalid input to getBalance method. tokenAddress, chainId and LPManagerAddress should be valid inputs");
        }
        let liquidityAdded;
        let LPManagerContract = LPManagerContractMap[chainId];

        if(!LPManagerContract) {
            let provider = await getProvider(chainId);
            LPManagerContract = new ethers.Contract(LPManagerAddress, config.LP_MANAGER_ABI, provider);
        }
        let tokenInfo = await LPManagerContract.tokensInfo(tokenAddress);
        if(tokenInfo && tokenInfo.liquidity != undefined) {
            liquidityAdded = tokenInfo.liquidity;
            if(liquidityAdded) {
                liquidityAdded = getFormattedValue({rawValue: liquidityAdded, chainId: chainId, tokenAddress: tokenAddress});
            }

        }
        return resolve(liquidityAdded);
    });
}

export {
    getFormattedValue,
    getDollarValue,
    getPoolInfo,
    getBalance,
    getLiquidityAdded
}