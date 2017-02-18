const sendPostRequest = (url, json) => {
    const data = NSString
        .stringWithString(JSON.stringify(json))
        .dataUsingEncoding(NSUTF8StringEncoding);

    const request = NSMutableURLRequest.alloc().init();
    request.setHTTPMethod_('POST');
    request.setURL_(NSURL.URLWithString_(url));
    request.setHTTPBody(data);
    request.setValue_forHTTPHeaderField_("application/json", "content-type");

    const response = NSURLConnection.sendSynchronousRequest_returningResponse_error_(request, nil, nil);
    const result = NSString.alloc().initWithData_encoding_(response, NSUTF8StringEncoding);

    return JSON.parse(result);
};