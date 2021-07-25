import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { config } from "../../config";

let graphClientMap = {};

let getGraphClient = (chainId) => {
    let client = graphClientMap[chainId];
    if(!client) {
        let chain = config.chainIdMap[chainId];
        if(chain && chain.graphURL) {
            client = new ApolloClient({
                uri: chain.graphURL,
                cache: new InMemoryCache({
                    fetchPolicy: "no-cache"
                })
            });
            graphClientMap[chainId] = client;
        }
    }
    return client;
}

let executeQuery = (chainId, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!chainId || !query) {
                return reject("Invalid chainId or query passed as parameter to executeQuery(). Please check the inputs");
            }
    
            let graphClient = getGraphClient(chainId);
            if(graphClient) {
                let data = await graphClient.query({
                    query: gql(query)
                });
                console.log("Data returned from SubGraph: ", data);
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