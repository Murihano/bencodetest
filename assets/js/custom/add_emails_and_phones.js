$('body').on('click','.add-email-input, .add-phone-input',function (e) {

    // Get the lest
    let $list = $( $(this).attr('data-list-selector')) ;

    // Try to find the counter of the list or use the length of the list
    let $counter = $list.data('widget-counter') || $list.children().length;

    // grab the prototype template
    let $newWidget = $list.attr('data-prototype');
    
    // replace the "__name__" used in the id and name of the prototype
    // with a number that's unique to your emails
    // end name attribute looks like name="contact[emails][2]"
    $newWidget = $newWidget.replace(/__name__/g, $counter);

    // Increase the counter
    $counter++;

    
    // And store it, the length cannot be used if deleting widgets is allowed
    $list.data('widget-counter', $counter);

    let $newElem = '';
    if ( e.target.id ==='add-email' )
    {
        // create a new list element and add it to the list
        $newElem = $($list.attr('data-widget-emailAddresses')).html($newWidget);
        
        // Add placeholder to input
        $input = $newElem.find('input').attr('placeholder','Saisissez une adresse e-mail');
    }
    else if( e.target.id ==='add-phone' )
    {
        // create a new list element and add it to the list
        $newElem = $($list.attr('data-widget-phones')).html($newWidget);
        
        // Add placeholder to input
        $input = $newElem.find('input').attr('placeholder','Saisissez un numéro de téléphone');
    }

    // Hide label 
    $label = $newElem.find('label');
    $label.remove();

    $input.wrap('<div class="input-group"></div>');
    $input.after('<button class="btn btn-danger delete-email-address" type="button"><i class="mdi mdi-delete"></i></button>');
    $newElem.appendTo($list);
});


// Delete email li
$('body').on('click','.delete-email-address, .delete-phone',function (e) {

    e.preventDefault();
    // remove the li for the 
    $li = $(this).closest('li');
    $li.remove();
})