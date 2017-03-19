const roundSize = size => Math.round(size * 10) / 10;

const iterateAndMap = (object, apply, argument) => {
    if (object.iterate === undefined) {
        return undefined;
    }

    const children = [];
    object.iterate(child => children.push(apply(child, argument)));
    return children;
};


/**
 * Layer
 */

const getLayerType = layer => {
    return layer.isArtboard ? 'artboard' :
           layer.isGroup    ? 'group' :
           layer.isImage    ? 'image' :
           layer.isPage     ? 'page' :
           layer.isShape    ? 'shape' :
           layer.isText     ? 'text' : undefined;
};

const getLayerFrame = layer => ({
    x: roundSize(layer.frame.x),
    y: roundSize(layer.frame.y),
    width: roundSize(layer.frame.width),
    height: roundSize(layer.frame.height)
});

const getLayerImageData = (layer, document) => {
    const path = getTemporaryFilePath('export.png');

    const slice = MSExportRequest
        .exportRequestsFromExportableLayer(layer.sketchObject)
        .firstObject();
    slice.setScale(1);

    document.sketchObject.saveArtboardOrSlice_toFile(slice, path);

    return 'data:image/png;base64,' + readFileAsBase64(path);
};

const describeLayer = (layer, document) => {
    const description = {
        name: layer.name + '',
        index: layer.index,
        type: getLayerType(layer),
        frame: getLayerFrame(layer),
        children: iterateAndMap(layer, describeLayer, document)
    };

    if (description.type === 'image') {
        description.image = getLayerImageData(layer, document);
    }

    return description;
};


/**
 * Page
 */

const describePage = (page, document) => ({
    name: page.name + '',
    layers: iterateAndMap(page, describeLayer, document)
});

const describePages = document => document.pages
    .filter(page => page.name != 'Symbols')
    .map(page => describePage(page, document));


/**
 * Document
 */

const hasDocumentId = context => hasDocumentValue(context, 'id');

const getDocumentId = context => getDocumentValue(context, 'id');

const setDocumentId = (context, id) => setDocumentValue(context, 'id', id);

const ensureDocumentId = context => {
    if (!hasDocumentId(context)) {
        const value = getNewDocumentId(context);

        if (value != undefined) {
            setDocumentId(context, value);
            return true;
        }

        return false;
    }

    return true;
};

const describeDocument = context => ({
    'id': getDocumentId(context),
    pages: describePages(context.api().selectedDocument)
});


/**
 * Plugin
 */

const getPluginName = context => {
    const components = context.scriptPath.pathComponents();
    return components[components.length - 4];
};


/**
 * Interaction
 */

const showToast = (context, text) => context.api().message(text);

const showPrompt = (context, text, value) => context.api().getStringFromUser(text, value);