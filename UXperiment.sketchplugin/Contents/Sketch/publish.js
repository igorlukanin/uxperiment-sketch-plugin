@import 'src/api.js';
@import 'src/config.js';
@import 'src/fs.js';
@import 'src/i18n.js';
@import 'src/network.js';
@import 'src/sketch.js';
@import 'src/transition.js';
@import 'src/ui.js';

@import 'select-initial-artboard.js';


var onRun = context => {
    if (!ensureApiReady(context)) {
        return;
    }

    if (!hasInitialArtboard(context)) {
        trySelectInitialArtboard(context);

        if (!hasInitialArtboard(context)) {
            return;
        }
    }

    const document = describeDocument(context);

    if (document === undefined) {
        showToast(context, _('publish.not-saved'));
        return;
    }

    const response = uploadDocument(context, document);

    showToast(context, response.success ? _('publish.success') : _('publish.failure'));
};