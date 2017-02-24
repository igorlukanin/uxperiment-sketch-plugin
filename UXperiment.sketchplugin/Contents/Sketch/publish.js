@import 'src/api.js';
@import 'src/config.js';
@import 'src/i18n.js';
@import 'src/network.js';
@import 'src/sketch.js';


var onRun = context => {
    if (!ensureApiReady(context)) {
        return;
    }

    const document = describeDocument(context);
    const response = uploadDocument(context, document);
    log(response);
};