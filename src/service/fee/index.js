import { executeQuery } from '../subgraph';
import { getFormattedValue, getDollarValue } from '../token';

function getDailyFee(chainId, startTime, endTime) {
    return new Promise(async (resolve, reject) => {
        try {
            if(!chainId) {
                return reject("Invalid chainId passed as parameter. Please check the inputs");
            }

            let query = `{
                feePerDays(
                  orderBy: epochTime,
                  orderDirection: desc,
                  where: {epochTime_gte:"${startTime}", epochTime_lte:"${endTime}"}) {
                  id
                  tokenAddress
                  totalFee
                  epochTime
                }
            }`
            let data = await executeQuery(chainId, query);

            let feeMap = new Map();
            if(data && data.data && data.data.feePerDays) {
                let aggregateData = data.data.feePerDays;
                if(aggregateData.length > 0) {
                    for(let index = 0; index < aggregateData.length; index++) {
                        let entry = aggregateData[index];
                        let currentFee = feeMap.get(entry.epochTime);
                        if(!currentFee) {
                            currentFee = 0;
                        }
                        let formattedValue = getFormattedValue({rawValue: entry.totalFee, chainId, tokenAddress: entry.tokenAddress});
                        currentFee += parseFloat(getDollarValue(formattedValue));
                        feeMap.set(entry.epochTime, currentFee);
                    }
                } else {
                    console.log(`No Deposit data found on chainId ${chainId}`)
                }
            }
            
            resolve(feeMap);
        } catch(error) {
            reject(error);
        }
    });
}

export {
    getDailyFee
}