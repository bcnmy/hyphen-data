import { executeQuery } from "../subgraph";
import { config } from "../../config";

function getUniqueUserCountByChain(chainId, version) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!chainId) {
                return reject(
                    "Invalid chainId passed as parameter. Please check the inputs"
                );
            }
            const query = `{
                uniqueWalletCounts{
                  id,
                  count
                }
            }`;
            const {
                data: { uniqueWalletCounts },
            } = await executeQuery(chainId, query, version);
            const { count: totalCount } = uniqueWalletCounts[uniqueWalletCounts.length - 1] || 0;
            resolve(totalCount);
        } catch (error) {
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
                    "Content-Type": "application/json;charset=utf-8",
                },
            };
            let response = await fetch(
                `${config.hyphen.baseURL}${config.hyphen.getUniqueUserCountPath}`,
                fetchOptions
            );
            if (response) {
                response = await response.json();
                uniqueUserCount = response.uniqueUserCount;
            }

            resolve(uniqueUserCount);
        } catch (error) {
            reject(error);
        }
    });
}

export { getUniqueUserCount, getUniqueUserCountByChain };
