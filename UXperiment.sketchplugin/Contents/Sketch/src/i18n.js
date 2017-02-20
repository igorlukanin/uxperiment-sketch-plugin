const l18nStrings = {
    api: {
        key_request: 'Enter your API key for UXperiment',
        key_present: 'Your API key for UXperiment was saved',
        no_key_present: 'There\'s no API key for UXperiment'
    }
};


const _ = path => path.split('.').reduce((value, key) => value[key], l18nStrings);