@import 'src/sketch.js';
@import 'src/network.js';


const uploadResult = result => {
    const url = 'http://localhost:4015/sketch';
    return sendPostRequest(url, result);
};


var onRun = context => {
	const sketch = context.api();
    const pages = sketch.selectedDocument.pages;

	const result = pages
        .filter(page => page.name != 'Symbols')
        .map(describePage);

    const response = uploadResult(result);
    log(response);
};