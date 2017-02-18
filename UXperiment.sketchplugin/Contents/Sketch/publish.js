@import 'src/sketch.js';


var onRun = context => {
	const sketch = context.api();
    const pages = sketch.selectedDocument.pages;

	const result = pages
        .filter(page => page.name != 'Symbols')
        .map(describePage);

    log(JSON.stringify(result, null, 2));
};