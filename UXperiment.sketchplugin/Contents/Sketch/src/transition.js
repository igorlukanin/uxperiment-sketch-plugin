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