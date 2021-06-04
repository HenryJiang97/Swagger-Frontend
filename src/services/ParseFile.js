// Parse file details (raw -> object)

import Api from "../models/api";
import Info from "../models/info";
import Parameter from "../models/parameter";
import Response from "../models/response";

const parseFile = (details) => {
    // Get api version
    let apiVersion = parseInt(details['swagger'] !== undefined ? details['swagger'] : details['openapi']);

    // Get info
    let info = new Info(
        details['info']['title'],
        details['info']['version'],
        details['info']['description'] === undefined ? "" : details['info']['description'],
    )
   
    // Get paths
    let paths = {};
    for (let [path] of Object.entries(details['paths'])) {
        paths[path] = {};
        for (let [method] of Object.entries(details['paths'][path])) {
            let parameters = [];
            let responses = {};

            for (let i in details['paths'][path][method]['parameters']) {
                parameters.push(new Parameter(
                    details['paths'][path][method]['parameters'][i]['name'],
                    details['paths'][path][method]['parameters'][i]['description'],
                    apiVersion === 2 
                    ? 
                    details['paths'][path][method]['parameters'][i]['type']
                    :
                    details['paths'][path][method]['parameters'][i]['schema']['type'],
                    apiVersion === 2
                    ?
                    details['paths'][path][method]['parameters'][i]['format']
                    :
                    details['paths'][path][method]['parameters'][i]['schema']['format']
                ));
            }

            for (let [code] of Object.entries(details['paths'][path][method]['responses'])) {
                responses[code] = new Response(
                    details['paths'][path][method]['responses'][code]['description']
                );
            }
            // console.log(responses);
            
            paths[path][method] = new Api(
                details['paths'][path][method]['summary'],
                parameters,
                responses,
            );
        }
    }

    // Get definitions
    // let definitions = apiVersion === 2 ? details['definitions'] : details['components']['schemas'];
    
    const result = {
        apiVersion: apiVersion,
        info: info,
        paths: paths,
        // definitions: definitions,
    };

    return result;
}

export {
    parseFile,
}