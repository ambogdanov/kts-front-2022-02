const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
    alias({
        '@root': './src/root',
        '@ApiStore': './src/shared/store/ApiStore',
        '@GitHubStore': './src/store/GitHubStore',
        '@shared': './src/shared'
    })(config);

    return config;
};