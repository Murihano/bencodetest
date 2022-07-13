
///::::::::::::::::::::::::::::::::::::::::( SLIDE PANEL )::::::::::::::::::::::::::::::::::::::::///
$(function () {

    // right side-bar toggle
    $('body').on('click', '.end-bar-toggle', function ($e)
    {
        // Prevent default
        $e.preventDefault();

        // Get page :
        var $btn      = $( this );
        var $url_ajax = $btn.attr( 'data-slide-panel' );

        // Stop if no url set
        if( !$url_ajax )
        {
            return;
        }

        $.ajax({
            url      : $url_ajax,
            method   : 'GET',
            dataType : 'html',
            error    : function ($data)
            {
                errorAjax();
            },
            success  : function( $result )
            {
                // Remove previous panel
                $( 'body > .end-bar-enabled' ).remove();

                // Display new panel loaded 
                $result = $( $result );
                $( 'body' ).append( $result );
                $('body').toggleClass('end-bar-enabled');
            },
        });
    });


    // Close panel on body click
    $('body').on('click',function ($e) {
        if ($($e.target).closest('.end-bar-toggle, .end-bar').length > 0)
        {
            return;
        }
        $('body').removeClass('end-bar-enabled');
        $('body').removeClass('sidebar-enable');
        $('.end-bar').remove();
        return;
    });

    
    // Close panel on  click on close icon
    $('body').on('click','.close-panel',function ($e) {
        $('body').removeClass('end-bar-enabled');
        $('body').removeClass('sidebar-enable');
        $('.end-bar ').remove();
        return;
    })
});


///::::::::::::::::::::::::::::::::::::::::( ERROR FUNCTION )::::::::::::::::::::::::::::::::::::::::///
function errorAjax()
{
    alert( 'Error' );
}
