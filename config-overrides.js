const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
    alias({
        '@root': 'src/root',
        '@apiStore': 'src/shared/store/ApiStore/',
        '@gitHubStore': 'src/store/GitHubStore/',
        '@shared': 'src/shared'
    })(config);

    return config;
};