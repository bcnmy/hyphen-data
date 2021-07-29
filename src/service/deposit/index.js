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

function getTotalDepositWithDuration(chainId, startTime, endTime) {
    return new Promise(async (resolve, reject) => {
        try {
            let totalDeposit = 0;
            if(!chainId) {
                return reject("Invalid chainId passed as parameter. Please check the inputs");
            }

            let query = `{
                fundsDepositeds(where :{timestamp_gte: ${startTime}, timestamp_lte: ${endTime}}) {
                    id
                    tokenAddress
                    amount
                }
            }`
            console.log(query);
            let data = await executeQuery(chainId, query);
            if(data && data.data && data.data.fundsDepositeds) {
                let depositData = data.data.fundsDepositeds;
                if(depositData.length > 0) {
                    for(let index = 0; index < depositData.length; index++) {

                        let _totalDeposit = depositData[index].amount;
                        let tokenAddress = depositData[index].tokenAddress;
                        _totalDeposit = getFormattedValue({rawValue: _totalDeposit, chainId, tokenAddress})
                        _totalDeposit = getDollarValue(_totalDeposit);
                        totalDeposit = totalDeposit + parseFloat(_totalDeposit);
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

function getDailyDepositsUSD(chainId, startTime, endTime) {
    return new Promise(async (resolve, reject) => {
        try {
            if(!chainId) {
                return reject("Invalid chainId passed as parameter. Please check the inputs");
            }

            let query = `{
                volumePerDays(
                  orderBy: epochTime,
                  orderDirection: desc,
                  where: {epochTime_gte:"${startTime}", epochTime_lte:"${endTime}"}) {
                  id
                  tokenAddress
                  totalAmount
                  epochTime
                }
            }`

            let data = await executeQuery(chainId, query);
            
            let volumeMap = {};
            if(data && data.data && data.data.volumePerDays) {
                let aggregateData = data.data.volumePerDays;
                if(aggregateData.length > 0) {
                    for(let index = 0; index < aggregateData.length; index++) {
                        let entry = aggregateData[index];
                        let currentVolume = volumeMap[entry.epochTime];
                        if(!currentVolume) {
                            currentVolume = 0;
                        }
                        let formattedValue = getFormattedValue({rawValue: entry.totalAmount, chainId, tokenAddress: entry.tokenAddress});
                        currentVolume += parseFloat(getDollarValue(formattedValue));
                        volumeMap[entry.epochTime] = currentVolume;
                    }
                } else {
                    console.log(`No Deposit data found on chainId ${chainId}`)
                }
            }
            resolve(volumeMap);
        } catch(error) {
            reject(error);
        }
    });
}

let getDepositData = (chainId, depositHash) => {
    return new Promise(async (resolve, reject) => {
        try {
            let depositData;
            let query = `query {
                fundsDepositeds(where: {id: "${depositHash}"}) {
                    id
                    from
                    toChainId
                    timestamp
                    tokenAddress
                    receiver
                    amount
                }
            }`
            let data = await executeQuery(chainId, query);
            if(data && data.data && data.data.fundsDepositeds && data.data.fundsDepositeds.length > 0) {
                depositData = {...data.data.fundsDepositeds[0]};
                if(depositData.amount != undefined) {
                    depositData.formattedAmount = getFormattedValue({rawValue: depositData.amount, chainId, tokenAddress: depositData.tokenAddress});
                    depositData.formattedAmountUSD = getDollarValue(depositData.formattedAmount);
                }
            }
            resolve(depositData);
        } catch(error) {
            reject(error);
        }
    });
}

let getDepositTransactions = (fromChainId, toChainId, numOfTransactions=30) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!fromChainId || !toChainId) {
                return reject("Invalid fromChainId or toChainId passed as parameter. Please check the inputs");
            }

            let query = `{
                fundsDepositeds(first: ${numOfTransactions}, where:{toChainId: ${toChainId}}) {
                  id
                  timestamp
                  tokenAddress
                }
            }`
            let data = await executeQuery(fromChainId, query);

            let depositTransactions = [];
            if(data && data.data && data.data.fundsDepositeds) {
                depositTransactions = data.data.fundsDepositeds;
            }
            resolve(depositTransactions);
        } catch(error) {
            reject(error);
        }
    });
}
export {
    getTotalDeposit,
    getTotalDepositPerNetwork,
    getDailyDepositsUSD,
    getTotalDepositWithDuration,
    getDepositData,
    getDepositTransactions
}