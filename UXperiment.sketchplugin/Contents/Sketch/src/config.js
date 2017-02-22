@import 'sketch.js'


const getFullConfigKey = (context, key) => {
    return getPluginName(context) + '.' + key;
};

const getConfigValue = (context, key) => {
    const defaults = NSUserDefaults.standardUserDefaults();
    return defaults.valueForKey(getFullConfigKey(context, key)) + '';
};

const hasConfigValue = (context, key) => getConfigValue(context, key) !== null;

const setConfigValue = (context, key, value) => {
    const defaults = NSUserDefaults.standardUserDefaults();
    defaults.setObject_forKey_(value, getFullConfigKey(context, key));

const getDocumentValue = (context, key) => {
    const store = context.command;
    const fullKey = getFullConfigKey(context, key);

    return context.api().selectedDocument.pages
        .map(page => store.valueForKey_onLayer_(fullKey, page.sketchObject))
        .reduce((value, current) => value !== undefined || current === null ? value : current, undefined);
};

const hasDocumentValue = (context, key) => getDocumentValue(context, key) !== undefined;

const setDocumentValue = (context, key, value) => {
    const store = context.command;
    const fullKey = getFullConfigKey(context, key);
    const page = context.api().selectedDocument.pages[0];
    store.setValue_forKey_onLayer_(value, fullKey, page.sketchObject);
};