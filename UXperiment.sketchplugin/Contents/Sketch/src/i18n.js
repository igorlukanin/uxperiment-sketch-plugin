const l18nStrings = {
    api: {
        key_request: 'Enter your API key for UXperiment',
        key_present: 'Your API key for UXperiment was saved',
        no_key_present: 'There\'s no API key for UXperiment'
    },
    publish: {
        'not-saved': 'Save the document before exporting it',
        success: 'Document exported to UXperiment',
        failure: 'Failed to export the document to UXperiment'
    },
    'add-transition': {
        'empty-selection': 'Select an element to create a transition',
        url_request: 'Enter a URL to be activated on click',
        dialog: {
            title: 'New transition to artboard',
            subtitle: 'Choose an artboard to be activated on click',
            'create-button': 'Create',
            'cancel-button': 'Cancel'
        },
        success: 'Transition created'
    },
    'select-initial-artboard': {
        dialog: {
            title: 'Initial artboard',
            subtitle: 'Choose an artboard from which a user starts',
            'select-button': 'Select',
            'cancel-button': 'Cancel'
        },
        success: 'Initial artboard selected'
    }
};


const _ = path => path.split('.').reduce((value, key) => value[key], l18nStrings);