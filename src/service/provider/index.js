import { ethers } from "ethers";
import { config } from "../../config";

let providerMap = {};

function getProvider(chainId) {
    return new Promise(async (resolve, reject) => {
        if(!chainId) {
            return reject("Invalid params to getProvider. Please pass a valid chainId");
        }

        let provider = providerMap[chainId];
        if(!provider) {
            provider = new ethers.providers.JsonRpcProvider(config.chainIdMap[chainId].rpcUrl);
            providerMap[chainId] = provider;
        }
        resolve(provider);
    });
}

export {
    getProvider
}