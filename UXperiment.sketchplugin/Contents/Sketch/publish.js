@import 'src/api.js';
@import 'src/config.js';
@import 'src/fs.js';
@import 'src/i18n.js';
@import 'src/network.js';
@import 'src/sketch.js';
@import 'src/transition.js';


var onRun = context => {
    if (!ensureApiReady(context)) {
        return;
    }

    const document = describeDocument(context);
    const response = uploadDocument(context, document);

    showToast(context, response.success ? _('publish.success') : _('publish.failure'));
};