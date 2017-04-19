@import 'src/api.js';
@import 'src/config.js';
@import 'src/fs.js';
@import 'src/i18n.js';
@import 'src/network.js';
@import 'src/sketch.js';
@import 'src/transition.js';
@import 'src/ui.js';


var onRun = context => {
	if (isSelectionEmpty(context)) {
		showToast(context, _('add-transition.empty-selection'));
		return;
	}

	const promptUrl = hasTransition(context, getSelectedLayer(context))
		? getTransition(context, getSelectedLayer(context)).value
		: 'http://';
	const url = showPrompt(context, _('add-transition.url_request'), promptUrl);

	if (url !== null) {
		setTransitionToUrl(context, getSelectedLayer(context), url);
		showToast(context, _('add-transition.success'));
	}
};