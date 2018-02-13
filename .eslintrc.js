module.exports = {
    "extends": "airbnb-base",
    "globals": {
        "expect": true,
        "describe": true,
        "it": true,
        "beforeEach": true,
        "server": true,
        "APIURL": true,
        "frisby": true,
        "after": true,
        "before": true,
        "afterEach": true,
        "beforeAll": true,
        "afterAll": true
    },
    "rules": {
        "global-require": "off",
        "class-methods-use-this": "off",
        "import/no-dynamic-require": "off",
        "comma-dangle": ["error", "never"],
        "linebreak-style": ["error", "unix"],
        "max-len": "off"
    }
};