(function ( $ ) {

  $.fn.foundationSelect = function() {

    // Check to see if custom dropdowns have already been drawn
    if (!$('.custom-dropdown-area').length) {

      // If custom dropdowns haven't been drawn, build and insert them
      return this.each(function () {
        selectedText = '';
        selected = '';
        translateClasses = '';
        select = $(this);
        selectId = select.attr('id');
        multiple = false;
        multiple = select.prop('multiple') ? true : false;
        options = '';

	    // check if a prompt is set
        if (typeof select.data('prompt') !== 'undefined') {
          var createOption = true;
	      // When prompt is empty string use a non breaking space
	      if(select.data('prompt') === '')  {
		    select.data('prompt', '&nbsp;');
		    createOption = false;
	      }
          selectPrompt = '<span class="default-label">' + select.data('prompt') + '</span>';

	      if(createOption) {
		    options = '<li class="disabled">' + selectPrompt + '</li>';
	      }
        } else {
          selectPrompt = 'Choose...';
        }
        select.find('option').each( function () {
          if ($(this).attr('selected')) {
            selected = 'selected';
            selectPrompt = "<div class='" + $(this).attr('class') + "'>" + $(this).html() + "</div>";
          }
          if( $(this).attr('class') ) {
            translateClasses = $(this).attr('class') + ' ';
          }
          options += '<li data-value="' + this.value + '" class="' + translateClasses + selected + '"><span class="option-title">' + $(this).html() + '</span></li>';
          selected = '';
        });
        newButton = '<div class="custom-dropdown-area" data-orig-select="#' + selectId + '"' + (multiple ? ' data-multiple="true"' : '') + '><a href="#" data-dropdown="select-' + selectId + '" class="custom-dropdown-button">' + selectPrompt + '</a> \
        <ul id="select-' + selectId + '" class="f-dropdown custom-dropdown-options" data-dropdown-content> \
          ' + options + ' \
        </ul></div>';
        select.hide();
        select.after(newButton);
      });
    };
  };

  // setup a listener to deal with custom dropdown clicks.
  $(document).on('click', '.custom-dropdown-area li', function () {
    if ($(this).hasClass('disabled')) {
      return false;
    }
    dropdown = $(this).closest('.custom-dropdown-area');
    multiple = dropdown.data('multiple') ? true : false;
    text = "<div class='" + $(this).attr('class') + "'>" + $(this).find('.option-title').html() + "</div>";
    value = $(this).data('value');
    totalOptions = dropdown.find('li').not('.disabled').length;
    origDropdown = $(dropdown.data('orig-select'));
    prompt = origDropdown.data('prompt');
	// Default prompt if not set
	if(typeof prompt === 'undefined') {
	  prompt = 'Choose...';
	}

    if (multiple) {
      $(this).toggleClass('selected');
      selectedOptions = [];
      selectedTitles = [];
	  selectedText = '{selected} of {total} selected';
      dropdown.find('.selected').each( function () {
        selectedOptions.push($(this).data('value'));
        selectedTitles.push($(this).find('.option-title').html());
      });
      origDropdown.val(selectedOptions).change();

	  // Check if selected text is configured
	  if(origDropdown.data('selectedText')) {
	    selectedText = origDropdown.data('selected-text');
	  }
      if (selectedOptions.length) {
        if (selectedOptions.length > 2) {
          dropdown
	          .find('.custom-dropdown-button')
	          .html(selectedText.replace('{selected}', selectedOptions.length).replace('{total}', totalOptions));
        }else{
          dropdown.find('.custom-dropdown-button').html(selectedTitles.join(', '));
        }
      }else{
        dropdown.find('.custom-dropdown-button').html(prompt);
      }
    }else{
      dropdown.find('li').removeClass('selected');
      Foundation.libs.dropdown.close($('#'+dropdown.find('ul').attr('id')));
      origDropdown.val(value).change();
      $(this).toggleClass('selected');
      dropdown.find('.custom-dropdown-button').html(text);
    }
  });

  $(document).on('reset', 'form', function () {
    if ($(this).find('.custom-dropdown-area').length) {
      $(this).find('.custom-dropdown-area').each( function () {
        origDropdown = $($(this).data('orig-select'));
        dropdown = $(this);
        multiple = dropdown.data('multiple') ? true : false;
        dropdown.find('li').removeClass('selected');
        if (typeof origDropdown.data('prompt') !== 'undefined') {
          prompt = origDropdown.data('prompt');
        }else{
          origDropdown.find('option').each( function () {
            if ($(this).attr('selected')) {
              prompt = $(this).html();
              dropdown.find('li[data-value="' + this.value + '"]').addClass('selected');
            }
          });
          if (prompt == '') {
            prompt = 'Choose...';
          }
        }
        dropdown.find('.custom-dropdown-button').html(prompt);
      });
    }
  });

}( jQuery ));
