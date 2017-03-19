const readFileAsBase64 = path => {
    const base64 = NSData
        .dataWithContentsOfURL(NSURL.fileURLWithPath(path))
        .base64EncodedStringWithOptions(0);

    return new String(base64).toString();
};

const getTemporaryFilePath = suffix => NSTemporaryDirectory() + suffix;