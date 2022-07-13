$(document).ready(function () {
    "use strict";
    $("#basic-datatable").DataTable({
        keys: !0,
        language: { paginate: { previous: "<i class='mdi mdi-chevron-left'>", next: "<i class='mdi mdi-chevron-right'>" } },
        drawCallback: function () {
            $(".dataTables_paginate > .pagination").addClass("pagination-rounded");
        },
        rowCallback: function( row, data )
        {
            let $price_format    ='';
            let $surface_format  = '';

            $price_format   = parseInt(data[2]);
            $surface_format = parseInt(data[0]);

            if ( !isNaN($price_format) )
            {
                $price_format        = spaceSeparateNumber(data[2]);
                $price_format        = $price_format + ' €';
                $('td:eq(2)', row).html( $price_format  );
            }
            if ( !isNaN($surface_format) )
            {
                $surface_format      = spaceSeparateNumber(data[0]);
                $surface_format      = $surface_format + ' m²';
                $('td:eq(0)', row).html( $surface_format  );
            }
            
        },

    });
});

// Re format the number with space
function spaceSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ' ' + '$2');
    }
    return val;
}