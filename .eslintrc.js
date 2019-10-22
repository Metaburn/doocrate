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
        'react'
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    }
};
