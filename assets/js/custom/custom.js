/** change color button views*/
let view = window.location.pathname.slice(19);
switch (view) {
    case '' :
        $("a[data-view='liste']").removeClass('btn-light');
        $("a[data-view='liste']").addClass('btn-secondary');
        $("a[data-view='liste']").attr('data-color', 'secondary') ;
        break;
    case 'tuile' :
        $("a[data-view='tuile']").removeClass('btn-light');
        $("a[data-view='tuile']").addClass('btn-secondary');
        $("a[data-view='tuile']").attr('data-color', 'secondary') ;
        break;
    case 'map' :
        $("a[data-view='map']").removeClass('btn-light');
        $("a[data-view='map']").addClass('btn-secondary');
        $("a[data-view='map']").attr('data-color', 'secondary') ;
        break;
}

/** Mini-map in page terrain/detail.html.twig */
/**If #map not exist in dom leaflet return console error*/
if ( $(' #map').length != 0 ) {

    if ($('#map').data('map') === 'mini-map') {
        var map = L.map('map').setView([$('#map').data('latitude'), $('#map').data('longitude')], 11);
//load all fragments of the map
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            // link of the scource of data
            attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
        }).addTo(map);

        marker = new L.marker([$('#map').data('latitude'), $('#map').data('longitude')]).addTo(map);

        marker.bindPopup($("#single-adresse").html());

    } else {
        var map = L.map('map').setView([47.1505, 1.0135], 5);

        //load all fragments of the map
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            // link of the scource of data
            attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
        }).addTo(map);

        $.get("/api/addresses",
            function (data) {
                for (let i = 0; i < data['hydra:member']['length']; i++) {
                    if (data['hydra:member'][i]['terrains']['length'] > 0) {
                        let terrainId = data['hydra:member'][i]['terrains'][0].slice(14);
                        urlTerrain = "/pro/terrain/show/" + terrainId;
                        marker = new L.marker([data['hydra:member'][i]['latitude'], data['hydra:member'][i]['longitude']]).addTo(map);

                        let message = ''
                        if (typeof data['hydra:member'][i]['roadNumber'] !== "undefined") {
                            message += data['hydra:member'][i]['roadNumber']+' ';
                        } else {
                            message += ''
                        }

                        if (typeof data['hydra:member'][i]['roadName'] !== "undefined") {
                            message += data['hydra:member'][i]['roadName']+'<br>';
                        } else {
                            message += ''
                        }

                        if (typeof data['hydra:member'][i]['postalCode'] !== "undefined") {
                            message += '<strong>'+data['hydra:member'][i]['postalCode']+'</strong><br>';
                        } else {
                            message += ''
                        }

                        if (typeof data['hydra:member'][i]['city'] !== "undefined") {
                            message += '<strong>'+data['hydra:member'][i]['city']+'</strong><br> ';
                        } else {
                            message += ''
                        }

                        if (typeof urlTerrain !== "undefined") {
                            message += '<a href=' + urlTerrain + '>Voir terrain</a>'
                        } else {
                            message += ''
                        }

                        marker.bindPopup(message)
                    }
                }
            });
    }
}

/**Terrain index page */
/** Make clickable card */
$(".card-click").click(function (event) {
     if ( !$(event.target).hasClass('card-action') )
     {
         window.location.href = ($(this).data('href'));
     }
     else
     {
         event.preventDefault();
     }
})


/** make clickable different lines of table terrain in terrain.index except delete link*/
$(".table-index-hoover").click(function (event) {

    // $data_conf = $(this).find('[data-conf]');
    // if ( $data_conf )
    // {
    //     event.preventDefault();
    // }
    if (event.target.id.slice(0, 22)  === "continue-modal-delete-"
        || event.target.id === "button-delete-terrain"
        || event.target.id === "icon-delete-terrain"
        || event.target.id === "cancel-delete-terrain")
    {
        event.preventDefault();
    }
    else
    {
        window.location.href = ($(this).attr('data-href'));
    }
})

/** Fade out popup-notification*/
function fadeOutPopup () {
    $(document).ready( function () {
        if ( $('.popup-notification') ) {
            setTimeout(function () {
                $('.popup-notification').fadeOut();
            }, 2500)
        }
    })
}

/**Usefull for success and update because popup is manage in server side by symfony*/
fadeOutPopup();


$(document).on("click", ".dropdown-toggle", function () {
    let terrainId = $(this).attr('data-id');
    $('#continue-modal-delete-' + terrainId).attr('data-terrain', terrainId);

    if ($(this).attr('id') === 'single-delete-terrain') {
        $('#continue-modal-delete-' + terrainId).attr('data-redirect', true);
    } else {
        $('#continue-modal-delete-' + terrainId).attr('data-redirect', false);
    }
});





// /** Delete Terrain*/
// $(".continue-dropdown-item-terrain").click(function (event)
// {
//     let terrainId = $(this).data('terrain');

//     $.ajax({
//         url: "/api/terrains/" + terrainId,
//         method: "DELETE",
//         success: function ()
//         {
//             redirect = $('#continue-modal-delete-' + terrainId).data('redirect');

//             if (redirect) {
//                 terrain_data = $('.single-adresse')[0].innerText;

//                 window.location.href = '/pro/terrain?delTerrain=' + terrain_data;
//             } else {
//                 terrain_data = $('tr[id="' + terrainId + '"] td');
//                 refTerrain = terrain_data[0].innerText+' '+terrain_data[1].innerText+' '+terrain_data[2].innerText;

//                 $('tr[id="' + terrainId + '"]').remove();

//                 $('#alert-area').append('   <div class="alert alert-danger alert-dismissible  border-0 fade show popup-notification" role="alert">\n' +
//                     '                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\n' +
//                     '                            Le terrain ' + refTerrain + ' à été supprimé !\n' +
//                     '                        </div>')
//                 fadeOutPopup();
//             }
//         }
//     })

//     $(this).removeData('terrain');
// })

// /**show delete message after delete on single page terrain and redirection*/
// paramDelTerrain = decodeURI(window.location.search).split("?delTerrain=");

// if (paramDelTerrain[1]) {
//     $('#alert-area').append('   <div class="alert alert-danger alert-dismissible  border-0 fade show popup-notification" role="alert">\n' +
//         '                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\n' +
//         '                            Le terrain ' + paramDelTerrain[1] + ' à été supprimé !\n' +
//         '                        </div>')
//     fadeOutPopup();
// }


///::::::::::::::::::::::::::::::::::::::::( DATA CONF MESSAGE )::::::::::::::::::::::::::::::::::::::::///
$( 'body' ).on( 'click', '[data-conf]', function( $event ){

    // Prevent default
    $event.preventDefault();
    $event.stopPropagation();

    // Set variable
    let $btn     = $( this );
    let $btn_url = $btn.attr( 'data-conf' );
    let $id      = $btn.attr('data-id');

    // Build popup
    var $conf_popup = '<div id="warning-header-modal" class="modal fade show conf_popup">';
    $conf_popup    += '<div class="modal-dialog">';
    $conf_popup    += '<div class="modal-content">';
    $conf_popup    += '<div class="modal-header modal-colored-header bg-warning">';
    $conf_popup    += '<h4 class="modal-title" id="warning-header-modalLabel">'+$varJs['conf_popup_mess_1']+'</h4>';
    $conf_popup    += '<button type="button" class="btn-close close_confirm" data-bs-dismiss="modal" aria-label="Close"></button>';

    $conf_popup    += '</div>';
    // $conf_popup    += '<div class="modal-body">';
    // $conf_popup    += '<h5>'+$varJs['conf_popup_mess_1']+'</h5>'
    // $conf_popup    += '</div>';

    $conf_popup    += '<div class="modal-footer">';
    $conf_popup    += '<button type="button" class="btn btn-light close_confirm" data-bs-dismiss="modal">'+$varJs['cancel']+'</button>';
    $conf_popup    += '<button  type="button" class="btn btn-warning valide_confirm" data-id="'+$id+'" data-href="'+$btn_url+'">'+$varJs['validate']+'</button>';
    $conf_popup    += '</div>';

    $conf_popup    += '</div>';
    $conf_popup    += '</div>';
    $conf_popup    += '</div>';

    // Remove previous popup
    $( '.conf_popup' ).remove();

    // Display new pop up
    $conf_popup = $( $conf_popup );
    $conf_popup.hide();
    $conf_popup.appendTo( 'body' );
    $('.modal').css("background-color" , "rgb(0,0,0)");
    $('.modal').css("background-color" , "rgba(0,0,0,0.4)");
    $conf_popup.show();

});

// On click cancel to confirmation popup
$( 'body' ).on( 'click', '.conf_popup .close_confirm', function(e){
    let $popup = $( this ).closest( '.conf_popup' );
    $popup.fadeOut( 100, function(){
        $popup.remove();
    });
});

// Close popup when click outside modal
$('body').on('mouseup',function ($event) {
    let $popup = $( '.conf_popup' );
    if ( $popup.length > 0 )
    {
        if ( $popup.has($event.target).length === 0 )
        {
            $popup.fadeOut( 100, function(){
                $popup.remove();
            });
        }
    }
})

// On click on valid delete item
$('body').on('click', 'button.valide_confirm',function ($event) {
    // Prevent default
    $event.preventDefault();
    $event.stopPropagation();

    let $data_url = $(this).attr('data-href');
    let $id       = $(this).attr('data-id');
    let $popup    = $(this).closest('.modal');

    // Stop if not url
    if (!$data_url)
    {
        return;
    }

    $.ajax({
    url: $data_url ,
    method: "GET",
    success: function ($result)
    {

        //console.log($result);
        // Find tr
        let $tr = $('tr[id='+$id+']');
        $popup.remove();
        $tr.remove();

        // display alert message
        alertMessage($varJs['deleted']);

        // Check if its the last tr
        let $all_tr = $('tr.table-index-hoover');

        if ($all_tr.length === 0)
        {
            window.location.reload();
        }
    },
    error:($data) =>
    {
        errorAjax();
    }
    })

})
///::::::::::::::::::::::::::::::::::::::::( END DATA CONF MESSAGE )::::::::::::::::::::::::::::::::::::::::///


///::::::::::::::::::::::::::::::::::::::::( ERROR FUNCTION )::::::::::::::::::::::::::::::::::::::::///
function errorAjax()
{
    alert( 'Error' );
}

///::::::::::::::::::::::::::::::::::::::::( ALERT MESSAGE FUNCTION )::::::::::::::::::::::::::::::::::::::::///
function alertMessage( $msg = '', $color = '' )
{
    let $alert = '';

    $alert += '<div class="alert alert-danger alert-dismissible  border-0 fade show popup-notification" role="alert">';
    $alert += '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
    $alert += $msg;
    $alert += '</div>';
    $('#alert-area').append($alert);
}




/** dynamic Search bar Terrain*/
$('#button-search-terrain').click( function (event) {
    event.preventDefault();
    findValue = $('#top-search-terrain').val();
    listAdresses = $('#index-terrain-list tr td:first-child');
    listCodePostal = $('#index-terrain-list tr td:nth-child(2)');
    listVille = $('#index-terrain-list tr td:nth-child(4)');
    listSurface = $('#index-terrain-list tr td:nth-child(5)');
    listPrix = $('#index-terrain-list tr td:nth-child(6)');
    listType = $('#index-terrain-list tr td:nth-child(7)');
    listViable = $('#index-terrain-list tr td:nth-child(8)');
    listCommercial = $('#index-terrain-list tr td:nth-child(9)');

    for (let i=0; i < listAdresses.length; i++ ) {
        $('#index-terrain-list tr')[i].style.display = "";

        if (findValue !== '') {
            arrayContent =
                listAdresses[i].innerText+' '
                +listCodePostal[i].innerText+' '
                +listVille[i].innerText+' '
                +listSurface[i].innerText+' '
                +listPrix[i].innerText+' '
                +listType[i].innerText+' '
                +listViable[i].innerText+' '
                +listCommercial[i].innerText.split(' ');

            if (arrayContent.indexOf(findValue) === -1) {
                $('#index-terrain-list tr')[i].style.display = "none";
            }
        }
    }
})

/** HideShow input viable projected price*/
$('#terrain_form_viable_1').click( function (event) {
    $('#projected_viable_group').removeClass("d-none");
})

$('#terrain_form_viable_0').click(function (event) {
    $('#projected_viable_group').addClass('d-none');
})

$(".select2").select2({
    language: {
        noResults: function () {
            return "Aucun résultats";
        }
    }
});

/**Set position menu*/
$('.open-left').click(
    function (event) {

        let value = $('body').attr('data-leftbar-compact-mode');
        if (value === 'condensed') {
            condensed = false;
        } else {
            condensed = true;
        }

        $.ajax({
            url: '/user/setting/post',
            contentType: 'application/json; charset=utf-8',
            method: 'POST',
            data: {condensedLeftsideMenu : condensed}
        }).done( function ($msg) {
           console.log($msg);
        });
    }
)
