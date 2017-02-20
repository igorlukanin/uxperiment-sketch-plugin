@import 'i18n.js';


const hasApiKey = context => hasConfigValue(context, 'api.key');

const getApiKey = context => getConfigValue(context, 'api.key');

const setApiKey = (context, key) => setConfigValue(context, 'api.key', key);

const checkApiKeyIsValid = key => {
    const url = 'http://localhost:4015/keys/' + key;
    const result = sendGetRequest(url);

    return result.success;
};

const ensureApiKey = context => {
    if (!hasApiKey(context) || !checkApiKeyIsValid(getApiKey(context))) {
        const sketch = context.api();
        const key = sketch.getStringFromUser(_('api.key_request'), getApiKey(context));

        if (key !== null && checkApiKeyIsValid(key)) {
            setApiKey(context, key);
            sketch.message(_('api.key_present'));
            return true;
        }

        sketch.message(_('api.no_key_present'));
        return false;
    }

    return true;
};