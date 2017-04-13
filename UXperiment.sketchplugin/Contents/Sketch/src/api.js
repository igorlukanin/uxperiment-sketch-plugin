/**
 * API key
 */

const apiHost = 'http://api.uxperiment.io';

const hasApiKey = context => hasConfigValue(context, 'api.key');

const getApiKey = context => getConfigValue(context, 'api.key');

const setApiKey = (context, key) => setConfigValue(context, 'api.key', key);

const checkApiKeyIsValid = key => {
    const url = apiHost + '/keys/' + key;
    const result = sendGetRequest(url);

    return result.success;
};


/**
 * Document
 */

const getNewDocumentId = context => {
    const data = {
        key: getApiKey(context)
    };

    const url = apiHost + '/ids';
    const result = sendPostRequest(url, data);

    return result.success ? result['id'] : undefined;
};

const uploadDocument = (context, document) => {
    const data = {
        key: getApiKey(context),
        document
    };

    const url = apiHost + '/sketch';
    const result = sendPostRequest(url, data);

    return result;
};


/**
 * API readiness
 */

const ensureApiKey = context => {
    if (!hasApiKey(context) || !checkApiKeyIsValid(getApiKey(context))) {
        const key = showPrompt(context, _('api.key_request'), getApiKey(context));

        if (key !== null && checkApiKeyIsValid(key)) {
            setApiKey(context, key);
            showToast(context, _('api.key_present'));
            return true;
        }

        showToast(context, _('api.no_key_present'));
        return false;
    }

    return true;
};

const ensureApiReady = context => ensureApiKey(context) && ensureDocumentId(context);