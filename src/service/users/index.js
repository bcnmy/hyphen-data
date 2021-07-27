import { executeQuery } from '../subgraph';

function getUniqueUserCount(chainId) {
    return new Promise(async (resolve, reject) => {
        try {
            let totalCount = 0;
            if(!chainId) {
                return reject("Invalid chainId passed as parameter. Please check the inputs");
            }

            let query = `query {
                uniqueWallets {
                    id
                }
            }`
            let data = await executeQuery(chainId, query);
            if(data && data.data && data.data.uniqueWallets) {
                let aggregateData = data.data.uniqueWallets;
                if(aggregateData) {
                    totalCount = aggregateData.length;
                }
            }
            resolve(totalCount);
        } catch(error) {
            reject(error);
        }
    });
}

export {
    getUniqueUserCount
}