const roundSize = size => Math.round(size * 10) / 10;

const iterateAndMap = (object, apply) => {
    if (object.iterate === undefined) {
        return undefined;
    }

    const children = [];
    object.iterate(child => children.push(apply(child)));
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

const describeLayer = layer => ({
    name: layer.name + '',
    index: layer.index,
    type: getLayerType(layer),
    frame: getLayerFrame(layer),
    children: iterateAndMap(layer, describeLayer)
});


/**
 * Page
 */

const describePage = page => ({
    name: page.name + '',
    layers: iterateAndMap(page, describeLayer)
});

const describePages = pages => pages
    .filter(page => page.name != 'Symbols')
    .map(describePage);


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
    pages: describePages(context.api().selectedDocument.pages)
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