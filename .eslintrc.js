module.exports = {
    extends: [
        'airbnb',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:react/recommended'
    ],
    settings: {
        react: {
            version: '16'
        }
    },
    plugins: [
        'react',
        'react-hooks'
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            ecmaVersion: 6,
            arrowFunctions: true,
            ecmaFeatures: {
                experimentalObjectRestSpread: true
            }
        }
    },
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
    }
};
