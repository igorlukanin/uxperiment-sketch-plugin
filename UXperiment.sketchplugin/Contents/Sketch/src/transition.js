const hasTransition = (context, fromLayer) => {
    return hasLayerValue(context, fromLayer, 'transition');
};

const getTransition = (context, fromLayer) => {
    try {
        return JSON.parse(getLayerValue(context, fromLayer, 'transition'));
    }
    catch (err) {
        return undefined;
    }
};

const setTransitionToArtboard = (context, fromLayer, toArtboardIndex) => {
    setLayerValue(context, fromLayer, 'transition', JSON.stringify({
        type: 'artboard',
        value: parseInt(toArtboardIndex)
    }));
};

const setTransitionToUrl = (context, fromLayer, toUrl) => {
    setLayerValue(context, fromLayer, 'transition', JSON.stringify({
        type: 'url',
        value: toUrl + ''
    }));
};


const hasInitialArtboard = context => hasDocumentValue(context, 'initial-artboard');

const isInitialArtboard = (context, artboard) => {
    try {
        return JSON.parse(getLayerValue(context, artboard, 'initial-artboard'));
    }
    catch (err) {
        return false;
    }
};

const selectInitialArtboard = (context, artboard, flag = true) => {
    setDocumentValue(context, 'initial-artboard', true);
    setLayerValue(context, artboard, 'initial-artboard', flag);
};