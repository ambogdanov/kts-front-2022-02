const { alias, configPaths } = require("react-app-rewire-alias");

module.exports = (config) => {
    const overrider = alias(configPaths("./tsconfig.paths.json"));
    return overrider(config);
};




//const { alias } = require('react-app-rewire-alias');
// module.exports = function override(config) {
//     alias({
//         '@root': 'src/root',
//         '@apiStore': 'src/shared/store/ApiStore/',
//         '@gitHubStore': 'src/store/GitHubStore/',
//         '@shared': 'src/shared'
//     })(config);
//
//     return config;
// };