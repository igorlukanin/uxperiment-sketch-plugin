const getFullConfigKey = (context, key) => {
    return getPluginName(context) + '.' + key;
};


/**
 * Per-installation config values
 */

const getConfigValue = (context, key) => {
    const defaults = NSUserDefaults.standardUserDefaults();
    return defaults.valueForKey(getFullConfigKey(context, key)) + '';
};

const hasConfigValue = (context, key) => getConfigValue(context, key) !== null;

const setConfigValue = (context, key, value) => {
    const defaults = NSUserDefaults.standardUserDefaults();
    defaults.setObject_forKey_(value, getFullConfigKey(context, key));
};


/**
 * Per-layer config values
 */

const getLayerValue = (context, layer, key) => {
    const store = context.command;
    const fullKey = getFullConfigKey(context, key);
    const value = store.valueForKey_onLayer_(fullKey, layer);

    return value !== undefined && value !== null ? value + '' : undefined;
};

const hasLayerValue = (context, layer, key) => getLayerValue(context, layer, key) !== undefined;

const setLayerValue = (context, layer, key, value) => {
    const store = context.command;
    const fullKey = getFullConfigKey(context, key);
    store.setValue_forKey_onLayer_(value, fullKey, layer);
};


/**
 * Per-document config values
 */

const getDocumentValue = (context, key) => {
    const value = context.api().selectedDocument.pages
        .map(page => getLayerValue(context, page.sketchObject, key))
        .reduce((value, current) => value !== undefined || current === null ? value : current, undefined);

    return value !== undefined && value !== null ? value + '' : undefined;
};

const hasDocumentValue = (context, key) => getDocumentValue(context, key) !== undefined;

const setDocumentValue = (context, key, value) => {
    const page = context.api().selectedDocument.pages[0];
    setLayerValue(context, page.sketchObject, key, value);
};