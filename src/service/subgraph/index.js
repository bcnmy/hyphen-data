import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { config } from "../../config";

let graphClientMap = {};

let getGraphClient = (chainId, version) => {
    let client = graphClientMap[chainId];
    if(client) client = client[version];
    if(!client) {
        let chain = config.chainIdMap[chainId];

        if(chain && chain.graphURL[version]) {
            client = new ApolloClient({
                uri: chain.graphURL[version],
                cache: new InMemoryCache({
                    fetchPolicy: "no-cache"
                })
            });
            graphClientMap[chainId]= {};
            graphClientMap[chainId][version] = client;
        }
    }
    return client;
}

let executeQuery = (chainId, query, version) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!chainId || !query) {
                return reject("Invalid chainId or query passed as parameter to executeQuery(). Please check the inputs");
            }
            console.log("Getting graph client for version ", version);
            let graphClient = getGraphClient(chainId, version);
            if(graphClient) {
                let data = await graphClient.query({
                    query: gql(query)
                });
                resolve(data);
            }
        } catch(error) {
            reject(error);
        }
    });
}

export {
    getGraphClient,
    executeQuery
}