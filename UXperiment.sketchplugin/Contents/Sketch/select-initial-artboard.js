@import 'src/api.js';
@import 'src/config.js';
@import 'src/fs.js';
@import 'src/i18n.js';
@import 'src/network.js';
@import 'src/sketch.js';
@import 'src/transition.js';
@import 'src/ui.js';


const trySelectInitialArtboard = context => {
	const page = context.api().selectedDocument.selectedPage;
	const artboards = getArtboardNames(page);
	const selectedArtboard = getSelectedArtboard(context);

	const selectedIndex = selectedArtboard !== undefined
		? artboards.indexOf(selectedArtboard.name())
		: artboards.length - 1;

	const options = {
		title: _('select-initial-artboard.dialog.title'),
		subtitle: _('select-initial-artboard.dialog.subtitle'),
		submitButton: _('select-initial-artboard.dialog.select-button'),
		cancelButton: _('select-initial-artboard.dialog.cancel-button')
	};

	const { dialog, buttons } = createArtboardSelectionDialog(options, artboards, selectedIndex);
	const response = dialog.runModal();

	if (response != "1000") {
		return;
	}

	const artboardIndex = getSelectedValueOfArtboardSelectionDialog(buttons, artboards);

	context.document.currentPage().artboards().forEach((artboard, i) => {
		selectInitialArtboard(context, artboard, i === artboardIndex);
	});

	showToast(context, _('select-initial-artboard.success'));
};

var onRun = trySelectInitialArtboard;