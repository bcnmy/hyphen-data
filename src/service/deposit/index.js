import { executeQuery } from '../subgraph';
import { getFormattedValue, getDollarValue } from '../token';

function getTotalDeposit(chainId, tokenAddress) {
    return new Promise(async (resolve, reject) => {
        try {
            let totalDeposit;
            if(!chainId || !tokenAddress) {
                return reject("Invalid chainId or tokenAddress passed as parameter. Please check the inputs");
            }

            let query = `query {
                depositAggregatedDatas(
                  where:{id: "${tokenAddress.toLowerCase()}"}
                ) {
                  id
                  amount
                }
            }`
            let data = await executeQuery(chainId, query);
            if(data && data.data && data.data.depositAggregatedDatas) {
                let aggregateData = data.data.depositAggregatedDatas;
                if(aggregateData.length > 0) {
                    totalDeposit = aggregateData[0].amount;
                    totalDeposit = getFormattedValue({rawValue: totalDeposit, chainId, tokenAddress})
                } else {
                    console.log(`No Deposit data found for tokenAddress ${tokenAddress} on chainId ${chainId}`)
                    totalDeposit = 0;
                }
            }
            resolve(totalDeposit);
        } catch(error) {
            reject(error);
        }
    });
}

function getTotalDepositPerNetwork(chainId) {
    return new Promise(async (resolve, reject) => {
        try {
            let totalDeposit = 0;
            if(!chainId) {
                return reject("Invalid chainId passed as parameter. Please check the inputs");
            }

            let query = `query {
                depositAggregatedDatas {
                  id
                  amount
                }
            }`
            let data = await executeQuery(chainId, query);
            if(data && data.data && data.data.depositAggregatedDatas) {
                let aggregateData = data.data.depositAggregatedDatas;
                if(aggregateData.length > 0) {
                    for(let index = 0; index < aggregateData.length; index++) {

                        let _totalDeposit = aggregateData[index].amount;
                        let tokenAddress = aggregateData[index].id;
                        _totalDeposit = getFormattedValue({rawValue: _totalDeposit, chainId, tokenAddress})
                        _totalDeposit = getDollarValue(_totalDeposit);
                        totalDeposit = totalDeposit + parseFloat(_totalDeposit);
                        console.log(totalDeposit);
                    }
                } else {
                    console.log(`No Deposit data found on chainId ${chainId}`)
                    totalDeposit = 0;
                }
            }
            resolve(totalDeposit);
        } catch(error) {
            reject(error);
        }
    });
}

export {
    getTotalDeposit,
    getTotalDepositPerNetwork
}