const roundSize = size => Math.round(size * 10) / 10;

const iterateAndMap = (object, apply, argument1, argument2) => {
    if (object.iterate === undefined) {
        return undefined;
    }

    const children = [];
    object.iterate(child => children.push(apply(child, argument1, argument2)));
    return children.filter(child => child !== undefined);
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

const isMeaningfulLayerDescription = description =>
    description.image !== undefined ||
    description.transition !== undefined ||
    description.children !== undefined;

const describeLayer = (layer, document, context) => {
    const type = getLayerType(layer);

    if (type === undefined) {
        return undefined;
    }

    const description = {
        name: layer.name + '',
        type,
        frame: getLayerFrame(layer),
        children: iterateAndMap(layer, describeLayer, document, context)
    };

    if (hasTransition(context, layer.sketchObject)) {
        description.transition = getTransition(context, layer.sketchObject);
    }

    if (type === 'artboard') {
        description.image = getLayerImageData(layer, document);
    }

    return isMeaningfulLayerDescription(description) ? description : undefined;
};


/**
 * Page
 */

const describePage = (page, document, context) => ({
    name: page.name + '',
    layers: iterateAndMap(page, describeLayer, document, context)
});

const describePages = (document, context) => document.pages
    .filter(page => page.name != 'Symbols')
    .map(page => describePage(page, document, context));

const getArtboards = page => iterateAndMap(page, layer => layer);

const getArtboardNames = page => getArtboards(page).map(artboard => artboard.name);


/**
 * Selection
 */
const isSelectionEmpty = context => context.selection.count() === 0;

const getSelectedLayer = context => context.selection[0];

const getSelectedArtboard = context => {
    let layer = getSelectedLayer(context);

    while (layer && !layer.isMemberOfClass(MSArtboardGroup.class())) {
        layer = layer.parentGroup();
    }

    return layer;
};


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

const getDocumentName = url => {
    if (url === null) {
        return undefined;
    }

    const parts = (url + '').split('/');
    return parts[parts.length - 1].replace(/\.sketch$/, '');
}

const describeDocument = context => {
    const name = getDocumentName(context.document.fileURL());

    if (name === undefined) {
        return undefined;
    }

    return {
        'id': getDocumentId(context),
        name,
        pages: describePages(context.api().selectedDocument, context)
    };
};


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