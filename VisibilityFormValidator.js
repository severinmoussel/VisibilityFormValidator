/**
 * Avoid validating not visible inputs
 */

var VisibilityFormValidator = {};

VisibilityFormValidator.search = 'form:not([novalidate])';
VisibilityFormValidator.observer = null;

/**
 * Initialized this validator for all actual and future forms
 */
VisibilityFormValidator.init = function() {
	// Look for already available forms
	$(VisibilityFormValidator.search).each(VisibilityFormValidator.prepareForm);

	// Look for future added forms
	VisibilityFormValidator.observe(function() {
		// If one of the new elements is a form
		$(this).filter(VisibilityFormValidator.search).each(VisibilityFormValidator.prepareForm);
		// If one of the new elements contains a form
		$(VisibilityFormValidator.search, this).each(VisibilityFormValidator.prepareForm);
	});
};

/**
 * Prepare a form to manually check its validity
 */
VisibilityFormValidator.prepareForm = function() {
	$(this)
		.attr('novalidate', true)
		.on('submit', VisibilityFormValidator.validateForm);
};

/**
 * Check form validity using browser native method
 */
VisibilityFormValidator.validateForm = function() {
	var isValid = true;
	// check only visible inputs
	$('input:visible, select:visible,textarea:visible', this).each(function() {
		// report validity returns validity of input and display error tooltip iff needed
		isValid = isValid && this.reportValidity();
		// break each loop if not valid
		return isValid;
	});
	// do not submit if not valid
	return isValid;
};

/**
 * Observe body to look for new forms
 * @param function cb The callback function
 */
VisibilityFormValidator.observe = function(cb) {
	// Avoid multiple observers
	if (VisibilityFormValidator.observer === null) {
		VisibilityFormValidator.observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				mutation.addedNodes && mutation.addedNodes.length > 0 && cb.call($(mutation.addedNodes));
			});
		}).observe(document.body, {childList: true, subtree: true});
	}
}

VisibilityFormValidator.init();
