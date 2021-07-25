import { BigNumber } from "ethers";
import { config } from "../../config";

function getFormattedValue({rawValue, chainId, tokenSymbol, tokenAddress, decimalPlace = 2}) {
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
    return formattedValue;
}

function getDollarValue(amount, symbol) {
    return amount;
}

export {
    getFormattedValue,
    getDollarValue
}