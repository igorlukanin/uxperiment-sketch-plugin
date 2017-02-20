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
};