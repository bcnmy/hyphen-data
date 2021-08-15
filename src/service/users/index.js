import { executeQuery } from '../subgraph';
import { config } from '../../config';

function getUniqueUserCountByChain(chainId) {
    return new Promise(async (resolve, reject) => {
        try {
            let totalCount = 0;
            if(!chainId) {
                return reject("Invalid chainId passed as parameter. Please check the inputs");
            }

            let query = `query {
                uniqueWallets(first: 1000) {
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

function getUniqueUserCount() {
    return new Promise(async (resolve, reject) => {
        let uniqueUserCount = 0;
        try {
            const fetchOptions = {
                method: "GET",
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                }
            }
            let response = await fetch(`${config.hyphen.baseURL}${config.hyphen.getUniqueUserCountPath}`, fetchOptions);
            if(response) {
                response = await response.json();
                uniqueUserCount = response.uniqueUserCount;
            }

            resolve(uniqueUserCount);
        } catch(error) {
            reject(error);
        }
    });
}

export {
    getUniqueUserCount,
    getUniqueUserCountByChain
}