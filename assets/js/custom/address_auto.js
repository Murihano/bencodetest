
///::::::::::::::::::::::::::::::::::::::::::::::::::[API GOUV BY AKTARMA]::::::::::::::::::::::::::::::::[AS]::::::::::::::::///
function initAddress() {

    ///-( Stop if not good page )
    if ( $('.address_block_data').length < 1 )
    {
        return;
    }

    // Hide block edit adress
    $('.block-edit-address').hide();

    // Show block edit adress on click on edit
    $('body').on('click', '#show-block-address',function (e)
    {
        $('.block-edit-address').show();
        $('#show-block-address').hide();
    })
    if ($('.invalid-feedback').length)
    {
        $('.block-edit-address').show();
        $('#show-block-address').hide();
    }
    $("#country").select2({
        language: {
            noResults: function () {
                return "Aucun résultats";
            }
        }
    });
    $('body').on('keyup','#auto_address',function(e) {
        let $address_query = $(this).val();

        $.ajax({
            url: "https://api-adresse.data.gouv.fr/search/?q="+$address_query+"&limit=1",
            method: "GET",
            dataType: "json",
            success: function ($data_address)
            {
                build_address($data_address);
            },
            error : function ($data)
            {
                if($data)
                {
                    ///-( Set address recap to empty )
                    $('.address_block_data .show_address_recap').html('');
                    return;
                }
            }
        });
    });


    ///-( Build address block )
    function build_address($data_address)
    {
        ///-( Stop if we don't have the address yet )
        if( $data_address.features.length === 0)
        {
            return;
        }

        ///-( Get all address data )
        let $address = $data_address.features[0];

        ///-( Get address details )
        let $result_type = $address.properties.type; // municipality, locality, street, housenumber cf. https://geo.api.gouv.fr/adresse
        let $housenumber = $address.properties.housenumber;
        let $city        = $address.properties.city;
        let $code_insee  = $address.properties.citycode;
        let $postal_code = $address.properties.postcode;

        let $lat         = $address.geometry.coordinates[1];
        let $lon         = $address.geometry.coordinates[0];

        ///-( Retrieve the registered address by default )
        let $default_address = $address.properties.label;

        let $road_name = '';
        if( $result_type == "housenumber" )
        {
            $road_name = $address.properties.street;
        }
        if( $result_type == "street" )
        {
            $road_name = $address.properties.name;
        }

        let $locality = '';
        if( $result_type == "locality" || $result_type == "municipality"  )
        {
            $locality = $address.properties.name;
        }


        ///-( Set address recap to empty )
        $('.address_block_data .show_address_recap').html('');

        ///-( If floor and additional info not empty )
        if ( $('.address_block_data #floor').val() !== '')
        {
            $('.address_block_data .show_address_recap').html($('.address_block_data .show_address_recap').val()+" ")
        }

        ///-( Address when type is housenumber )
        if( $result_type == 'housenumber')
        {
            $('.address_block_data #road_name').val($road_name);
            $('.address_block_data #road_number').val($housenumber);
            $('.address_block_data .show_address_recap').html($('.address_block_data .show_address_recap').html() + $housenumber + ', ' + $road_name+ '<br>');
            $('.address_block_data .adresse_readonly').show();
        }
        ///-( Address when type is street  we dont have house number )
        else if( $result_type=='street' )
        {
            $('.address_block_data #road_name').val($road_name);
            $('.address_block_data #road_number').val('');
            $('.address_block_data .show_address_recap').html($('.address_block_data .show_address_recap').html() +$road_name + '<br>');
            $('.address_block_data .adresse_readonly').show();
        }
        ///-( Address without road name & road number )
        else
        {
            $('.address_block_data #road_name').val('');
            $('.address_block_data #road_number').val('');
            $('.address_block_data .show_address_recap').html($('.address_block_data .show_address_recap').html()+'');
            $('.address_block_data .adresse_readonly').show();
        }



        ///-( Address locality )
        $("#locality").val($locality);
        if( $locality !== '')
        {
            $('.address_block_data .show_address_recap').html($('.address_block_data .show_address_recap').html()+ $locality +'<br>');
            $('.address_block_data .adresse_readonly').show();
        }

        ///-( Always the same )
        $('.address_block_data #postal_code').val($postal_code);
        $('.address_block_data #city').val($city);
        $('.address_block_data #latitude').val($lat);
        $('.address_block_data #longitude').val($lon);


        ///-( If an address has been proposed, then we are in France )
        $('#country option[value="75"]').prop("selected", true);
        $('.address_block_data .show_address_recap').html($('.address_block_data .show_address_recap').html()  + $postal_code + ' ' + $city+'<br>');
        $('.country_label').html($('#country').find(":selected").text());
    }


    ///-( Address sended by user from address block)
    let $search_arddress_by_address_block = '';
    $('body').on('keyup', '.address_block_data #floor,.address_block_data #additional_information,.address_block_data #road_number,.address_block_data #road_name,.address_block_data #locality,.address_block_data #postal_code,.address_block_data #city',function (e)
    {
        $('.address_block_data .show_address_recap').html('');
        if($('.address_block_data #road_number').val() !== '')
        {
            $('.address_block_data .show_address_recap').html($('.address_block_data .show_address_recap').html() + $('.address_block_data #road_number').val()+', ');
            $search_arddress_by_address_block = $('.address_block_data #road_number').val()+ ' ';
        }
        if($('.address_block_data #road_name').val() !== '')
        {
            $('.address_block_data .show_address_recap').html($('.address_block_data .show_address_recap').html() + $('.address_block_data #road_name').val()+'<br>');
            $search_arddress_by_address_block += $('.address_block_data #road_name').val()+' ';
        }
        if($('.address_block_data #locality').val() !== '')
        {
            $('.address_block_data .show_address_recap').html($('.address_block_data .show_address_recap').html() + $('.address_block_data #locality').val()+'<br>');
        }
        if($('.address_block_data #postal_code').val() !== '')
        {
            $('.address_block_data .show_address_recap').html($('.address_block_data .show_address_recap').html() + $('.address_block_data #postal_code').val()+' ');
            $search_arddress_by_address_block += $('.address_block_data #postal_code').val()+' ';
        }
        if($('.address_block_data #city').val() !== '')
        {
            $('.address_block_data .show_address_recap').html($('.address_block_data .show_address_recap').html() + $('.address_block_data #city').val()+'<br>');
            $search_arddress_by_address_block += $('.address_block_data #city').val();
        }
                if( $('.address_block_data #floor').val() !== '' )
        {
            $('.address_block_data .show_address_recap').html($('.address_block_data .show_address_recap').html() + $('.address_block_data #floor').val()+'<br>' );
        }
        if($('.address_block_data #additional_information').val() !== '')
        {
            $('.address_block_data .show_address_recap').html($('.address_block_data .show_address_recap').html() + $('.address_block_data #additional_information').val()+'<br>');
        }
        $('.address_block_data .adresse_readonly').show();
        let $url =  "https://api-adresse.data.gouv.fr/search/?q=" + encodeURIComponent($search_arddress_by_address_block) +  "&limit=1";
        $.ajax({
            url: $url,
            method: "GET",
            dataType: "json",
            success: function ($address)
            {
                check_address($address);
            },
            error : function ($data)
            {
                return;
            }
        });
    })

    ///-( On select country)
    $('body').on('change','#country', function (e) {
        $val = $(this).val();
        $('.country_label').html($(this).find(":selected").text());
    })

    ///-( Check if address sended by user is same to address finded by API )
    function check_address($address)
    {
        ///-( Stop if we don't have the address yet )
        if( $address.features.length === 0)
        {
            return;
        }

        let $address_from_block =  $address.features[0].properties.label;

        if
        (
            ($search_arddress_by_address_block.toUpperCase().replace(/[^A-Z0-9]+/ig, "_"))
            !==
            ($address_from_block.toUpperCase().replace(/[^A-Z0-9]+/ig, "_"))
        )
        {
            $('.address_block_data .not_good_address').show();
        }
        else
        {
            $('.address_block_data .not_good_address').hide();
        }
    }
};


/// Run function
initAddress();



///::::::::::::::::::::::::::::::::::::::::( MODAL )::::::::::::::::::::::::::::::::::::::::///
$(function () {

    // Open modal
    $('body').on('click', '.open-modal', function ($e)
    {
        // Prevent default
        $e.preventDefault();

        // Get page :
        var $btn      = $( this );
        var $url_ajax = $btn.attr( 'data-modal-method' );

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
                // Remove previous modal
                $( 'body > .modal' ).remove();

                // Display new modal
                $result = $( $result );
                $( 'body' ).append( $result );
                $('body').toggleClass('modal-open');
                initAddress();

                // if we have select2 to shwo select2 option inside the modal
                if ( $('.select2').length)
                {
                    $('.select2').select2({
                        dropdownParent: $('.modal-content')
                    });
                }

            },
        });
    });

    // Close modal on body click
    $('body').on('click',function ($e) {
        if ($($e.target).closest('.modal-content').length > 0)
        {
            return;
        }

        // Quand on supprime une option d'un select multiple on ferme pas le modal
        if($($e.target).hasClass('select2-selection__choice__remove'))
        {
            return;
        }
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $('.modal').remove();
        return;
    });
    // Férmer le modal quan on clique sur x
    $('body').on('click','.close-modal',function () {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $('.modal').remove();
        return;
    })
});

    
///::::::::::::::::::::::::::::::::::::::::( POST AJAX )::::::::::::::::::::::::::::::::::::::::///
$(function () {

    // right side-bar toggle
    $('body').on('submit', '.post_ajax', function ($e)
    {
        // Prevent default
        $e.preventDefault();

        // Get page :
        let $form     = $( this );
        let $url      = $form.attr('data-url');
        let $form_id  = $form.attr( 'id' );
        let $data     = $form.serializeArray();
        let $popup    = $(this).closest('.global-popup');

        let $submit_btn = $form.find("button[type=submit]");

        // Stop if no url set
        if( !$url )
        {
            return;
        }

        $submit_btn.remove();
        $.ajax({
            url      : $url,
            type     : 'post',
            data     : $data,
            dataType : 'html',
            error    : function ($data)
            {
                let $res = $data.responseText;
                // show error messages
                if ($data.status === 422)
                {
                    $result = $( '<div>'+$res+'</div>' );
                    $result = $result.find( 'form#'+$form_id );
                    if( $result.length > 0 )
                    {
                        $result = $result.html();
                        $form.html( $result );

                        // if we have select2 to shwo select2 option inside the modal and refresh select2
                        if ( $('.select2').length)
                        {
                            $('.select2').select2();
                            $('.select2').select2({
                                dropdownParent: $('.modal-content')
                            });
                        }
                    }
                    return;
                }
                errorAjax();
            },
            success  : function( $result )
            {
                ///-( trim result )
                $result = $result.trim();

                ///-( if save success : we need a redirect )
                if( $result.indexOf('redirect:') === 0 )
                {
                    if(typeof $popup !== 'undefined')
                    {
                        $popup.remove();
                    }
                    // Reset form 
                    $form[0].reset();

                    // if select2 in modal
                    if ( $('.select2').length )
                    {
                        $('.select2').val(null).trigger('change');
                    }
                    $('.start-page-content').prepend('<div class="d-flex justify-content-center"><div class="spinner-border avatar-lg text-danger" role="status"></div></div>');
                    $result = $result.replace( 'redirect:', '' );
                    window.location.replace( $result );
                    return;
                }
            },
        });
    });

});



///::::::::::::::::::::::::::::::::::::::::( DELETE ADDRESS )::::::::::::::::::::::::::::::::::::::::///
$('body').on('click','.delete-address',function (e) {

    // Prevent default
    e.preventDefault();
    let $btn = $(this);
    let $id = $btn.attr('data-address-id');

    // Stop if not id
    if ( !$id )
    {
        return;
    }

    // Get block
    let $recap  = $btn.closest('.adresse_readonly');
    $('.address_block_data #postal_code').val('');
    $('.address_block_data #city').val('');

    // Ajax post 
    $.ajax({
        url:'/address/delete/'+$id,
        type: "post",
        data: { "_token":$varJs['csrf_token'],'id':$id },
        success: ( $data ) =>
        {
            $recap.hide();
            $btn.remove();

        },
        error:($data) =>
        {
            errorAjax();
        }
    });

})




///::::::::::::::::::::::::::::::::::::::::( ERROR FUNCTION )::::::::::::::::::::::::::::::::::::::::///
function errorAjax()
{
    alert( 'Error' );
}
