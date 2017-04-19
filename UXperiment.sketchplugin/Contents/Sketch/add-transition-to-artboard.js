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

	const page = context.api().selectedDocument.selectedPage;
	const artboards = getArtboardNames(page);
	const selectedArtboard = getSelectedArtboard(context);
	const selectedIndex = artboards.indexOf(selectedArtboard.name());

	const options = {
		title: _('add-transition.dialog.title'),
		subtitle: _('add-transition.dialog.subtitle'),
		submitButton: _('add-transition.dialog.create-button'),
		cancelButton: _('add-transition.dialog.cancel-button')
	};

	const { dialog, buttons } = createArtboardSelectionDialog(options, artboards, selectedIndex);
	const response = dialog.runModal();

	if (response != "1000") {
		return;
	}

	const artboardIndex = getSelectedValueOfArtboardSelectionDialog(buttons, artboards);
	setTransitionToArtboard(context, getSelectedLayer(context), artboardIndex);

	showToast(context, _('add-transition.success'));
};