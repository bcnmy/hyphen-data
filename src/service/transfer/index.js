import { executeQuery } from '../subgraph';
import { getFormattedValue, getDollarValue } from '../token';

let getTransferData = (chainId, depositHash, version) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transferData;
            let query = `query {
                fundsSentToUsers(where: {depositHash: "${depositHash}"}) {
                    id
                    tokenAddress
                    amount
                    receiver
                    lpFee
                    timestamp
                    feeEarned
                    gasPrice
                    depositHash
                    transferredAmount
                }
            }`
            let data = await executeQuery(chainId, query, version);
            if(data && data.data && data.data.fundsSentToUsers && data.data.fundsSentToUsers.length > 0) {
                transferData = {...data.data.fundsSentToUsers[0]};
                if(transferData.amount != undefined) {
                    transferData.formattedAmount = getFormattedValue({rawValue: transferData.transferredAmount, 
                        chainId, tokenAddress: transferData.tokenAddress});
                    transferData.formattedAmountUSD = getDollarValue(transferData.formattedAmount, transferData.tokenAddress);

                    transferData.formattedFeeEarned = getFormattedValue({rawValue: transferData.feeEarned, 
                        chainId, tokenAddress: transferData.tokenAddress});
                    transferData.formattedFeeEarnedUSD = getDollarValue(transferData.formattedFeeEarned, transferData.tokenAddress);
                }
            }
            resolve(transferData);
        } catch(error) {
            reject(error);
        }
    });
}

let getTransferTransaction = (chainId, depositHash, version) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transferData;
            let query = `query {
                fundsSentToUsers(where: {depositHash: "${depositHash}"}) {
                    id
                    timestamp
                }
            }`
            let data = await executeQuery(chainId, query, version);
            if(data && data.data && data.data.fundsSentToUsers && data.data.fundsSentToUsers.length > 0) {
                transferData = data.data.fundsSentToUsers[0];
            }
            resolve(transferData);
        } catch(error) {
            reject(error);
        }
    });
}

export {
    getTransferData,
    getTransferTransaction
}