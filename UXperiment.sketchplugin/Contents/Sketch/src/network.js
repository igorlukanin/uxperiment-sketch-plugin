const sendRequest = (method, url, json) => {
    const request = NSMutableURLRequest.alloc().init();
    request.setHTTPMethod_(method);
    request.setURL_(NSURL.URLWithString_(url));
    request.setValue_forHTTPHeaderField_("application/json", "content-type");

    if (json !== undefined) {
        const data = NSString
            .stringWithString(JSON.stringify(json))
            .dataUsingEncoding(NSUTF8StringEncoding);

        request.setHTTPBody(data);
    }

    const response = NSURLConnection.sendSynchronousRequest_returningResponse_error_(request, nil, nil);
    const result = NSString.alloc().initWithData_encoding_(response, NSUTF8StringEncoding);

    try {
        return JSON.parse(result);
    }
    catch (err) {
        return { success: false, err };
    }
};

const sendGetRequest = (url, json) => sendRequest('GET', url, json);

const sendPostRequest = (url, json) => sendRequest('POST', url, json);