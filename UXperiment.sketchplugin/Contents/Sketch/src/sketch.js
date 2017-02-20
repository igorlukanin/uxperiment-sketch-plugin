const roundSize = size => Math.round(size * 10) / 10;

const iterateAndMap = (object, apply) => {
    if (object.iterate === undefined) {
        return undefined;
    }

    const children = [];
    object.iterate(child => children.push(apply(child)));
    return children;
};

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

const describePage = page => ({
    name: page.name + '',
    layers: iterateAndMap(page, describeLayer)
});

const getPluginName = context => {
    const components = context.scriptPath.pathComponents();
    return components[components.length - 4];
};