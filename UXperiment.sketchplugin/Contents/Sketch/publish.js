@import 'src/api.js';
@import 'src/config.js';
@import 'src/i18n.js';
@import 'src/network.js';
@import 'src/sketch.js';


const uploadDocument = (key, document) => {
    const data = {
        key,
        document
    };

    const url = 'http://localhost:4015/sketch';
    return sendPostRequest(url, data);
};


var onRun = context => {
    if (!ensureApiReady(context)) {
        return;
    }

    const sketch = context.api();
    const document = sketch.selectedDocument;

    const result = document.pages
        .filter(page => page.name != 'Symbols')
        .map(describePage);

    const response = uploadDocument(getApiKey(context), result);
    log(response);
};