///::::::::::::::::::::::::::::::::::::::::( DROPZONE JS BY AKTARMA )::::::::::::::::::::::::::::::::::::::::///
import Dropzone from "dropzone";

if ( $('#akDropzone').length )
{
    $(function () {
        // Drop zone option :
        let $max_size        = typeof($varJs['max_size'])        !== 'undefined' ? $varJs['max_size']         : 100
        let $max_file        = typeof($varJs['max_file'])        !== 'undefined' ? $varJs['max_file']         : 20;
        let $resize_width    = typeof($varJs['resize_width'])    !== 'undefined' ? $varJs['resize_width']     : null;
        let $resize_height   = typeof($varJs['resize_height'])   !== 'undefined' ? $varJs['resize_height']    : null;
        let $resize_method   = typeof($varJs['resize_method'])   !== 'undefined' ? $varJs['resize_method']    : 'contain';
        let $resize_quality  = typeof($varJs['resize_quality'])  !== 'undefined' ? $varJs['resize_quality']   : 0.8;
        let $accepted_file   = typeof($varJs['accepted_file'])   !== 'undefined' ? $varJs['accepted_file']    : '.sql,.csv,.psd,.ai,.eps,.pdf,.doc,.ppt,.pptx,.xls,.jpg,.png,.jpeg,.gif,.gz,.gzip,.gtar,.tar,.zip,.rar,.mp2,.mp3,.wav,.bmp,.ram,.tif,.tiff,.txt,.text,.xml,.mpeg,.mpg,.mpe,.mov,.avi,.docx,.dot,.dotx,.xlsx,.word,.xl,.json,.mp4,.ogg,.svg,.7zip';

        // Deactivate dropzone to load and search dropzone <form> from the dom directly
        Dropzone.autoDiscover = !1;
    
        // Preview template for show uploded files befor sent its to server
        let $previewTemplate = document.querySelector('#uploadPreviewTemplate').innerHTML;
    
        // Create dropzone with imperative mode
        $("#akDropzone").dropzone({ 
    
            url                 : '/upload/',
            method              : "post",
            parallelUploads     : 1,
            maxFiles            : $max_file,
            previewsContainer   : '.dropzone-previews',
            previewTemplate     : $previewTemplate,
            autoQueue           : true, // Make sure the files aren't queued until manually added
            uploadMultiple      : true,
            acceptedFiles       : $accepted_file,
            maxFilesize         : $max_size,
            addRemoveLinks      : false,
            dictInvalidFileType :"Cette extension de fichier n'est pas autorisée",
            dictFileTooBig      :"Ce fichier dépasse le poids autorisé",
            dictResponseError   :'Une erreur s\'est produite, veuillez réessayez ou contacter l\'administrateur système.',
            dictMaxFilesExceeded:'Vous devez ajouter au max ' +$varJs['max_file']+ ' document',
            resizeWidth         : $resize_width,
            resizeHeight        : $resize_height,
            resizeMethod        : $resize_method,
            resizeQuality       : $resize_quality,
            init: function ()
            {
                const akDropzone = this;

                // Display files from the server :

                // Set variables
                let $hidden_field = $( '[type="hidden"].uploaded_file' );
                let $values       = $hidden_field.attr( 'value' );
                if ($values === '|')
                {
                    $hidden_field.val('');
                }
                if ( $values) 
                {
                    let $values_split = $values.split( '|' );
    
                    // Prep post
                    let $post       = {}
                    let $tn         = "_token";
                    $post[$tn]      = $varJs['csrf_token'];
                    $post['tokens'] = $values_split;

                    // Ajax post
                    $.ajax({
                        url      : '/upload/get_upload_data',
                        type     : 'POST',
                        data     : $post,
                        dataType : 'JSON',
                        success  : function( $data )
                        {
                            let  $file_path = '';
                            $data.forEach($element => {
                                let mockFile = { name: $element['name'] };
                                akDropzone.options.addedfile.call(akDropzone, mockFile);
                                if ( $element['is_img'] === false )
                                {
                                    if ( $element['extension'] === 'pdf' ||  $element['extension'] === 'doc' || $element['extension'] === 'xls')
                                    {
                                        $file_path ='/build/icon/'+$element['extension']+'_icon.png';
                                    }
                                    // Other type
                                    else
                                    {
                                        $file_path ='/build/icon/other_icon.png';
                                    }
                                }
                                else
                                {
                                    $file_path =  $element['path'];
                                }

                                akDropzone.options.thumbnail.call( akDropzone, mockFile, $file_path );
                                akDropzone.options.complete.call( akDropzone, mockFile );
                                akDropzone.options.success.call( akDropzone, mockFile );
                                $(mockFile.previewElement).attr( 'id', $element['token'] ); //add id to preview div
                                $(".progress").remove();
                                $("[data-dz-size]").remove();
                            });
                        },
                        error: ( $data ) => 
                        {
                            errorAjax();
                        }
                    });
                }

                // Sending event
                this.on("sending", function (file) {
    
                });
                // Added files event
                this.on("addedfiles", function (files) {
                    files.forEach( file =>{
                        // Get file type ( pdf,excel,word for show the good icon )
                        let ext = file.name.split('.').pop();
                        if (ext == "pdf")
                        {
                            $(file.previewElement).find("[data-dz-thumbnail]").attr("src","/build/icon/pdf_icon.png");
                        }
                        else if (ext.indexOf("doc") != -1)
                        {
                            $(file.previewElement).find("[data-dz-thumbnail]").attr("src","/build/icon/word_icon.png");
                        }
                        else if (ext.indexOf("xls") != -1)
                        {
                            $(file.previewElement).find("[data-dz-thumbnail]").attr("src","/build/icon/excel_icon.png");
                        }
                        // Other type
                        else if(ext !== "xls" && ext !== "pdf" && ext !== "jpg" && ext !== "jpeg" &&  ext !== "png" && ext !== "gif" && ext !== "doc" )
                        {
                            $(file.previewElement).find("[data-dz-thumbnail]").attr("src","/build/icon/excel_icon.png");
                        }
                    });
                });

                // Success upload event
                this.on("successmultiple" , function (files, response) {
                    let $result  = JSON.parse(response);
                    let $my_file  = files['0'].previewTemplate;

                    // Add token to file div
                    $my_file.setAttribute('id',$result['0']); 
                    let $hidden_field  = $('[type="hidden"].uploaded_file');
                    let $old_value     = $hidden_field.val();
                    let $new_value     = $old_value === '' ? $old_value + $result['0'] : $old_value+ '|' + $result['0'];
                    $new_value         = $new_value.trim( '|' );
                    $new_value         = $new_value.replace( '||', '|' );
                    $hidden_field.val( $new_value );
                });
    
                this.on("removedfile", function (file) {
                    
                    let $file  = $(file.previewTemplate);
                    let $token = $file.attr("id");
    
                    // Delete file div 
                    $file.remove();
    
                    // Id file was successfuly uploded and we want to delete it from server and db 
                    // For some browsers, `attr` is undefined; for others`attr` is false.check for both.
                    if (typeof $token !== 'undefined' && $token !== false)
                    {
                        //prep post 
                        let $post       = {}
                        let $tn         = "_token";
                        $post[$tn]      = $varJs['csrf_token'];
                        $post['token']  = $token
            
                        //ajax post 
                        $.ajax({
                            url:'/upload/delete/'+$token,
                            type: "post",
                            data: { "_token":$varJs['csrf_token'],'token':$token },
                            success: (data) =>
                            {
                                // console.log(data);
                            },
                            error: (data) => 
                            {
                                errorAjax();
                            }
                        });

                        // Update hidden field value )
                        let $hidden_field  = $('[type="hidden"].uploaded_file');
                        if( $hidden_field.length > 0 )
                        {
                            let $old_value_hidden_field = $hidden_field.val();
                            let $new_value_hidden_field = $old_value_hidden_field.replace( $token, '' );
                            $new_value_hidden_field     = $new_value_hidden_field.trim( '|' );
                            $new_value_hidden_field     = $new_value_hidden_field.replace( '||', '|' );
                            $hidden_field.val( $new_value_hidden_field );
                        }
                    }
    
                });
    
                this.on("errormultiple", function (files, message) {
                    files.forEach(file => {
                        if(file.status === "error")
                        {
                            file.previewElement.classList.add("dz-error");

                            // Server error
                            if (message.status === 500)
                            {
                                message = 'Une erreur s’est produite, veuillez réessayer. Si le problème persiste, contactez le service technique.';
                            }
                            if (typeof message !== "string" && message.error)
                            {
                                message = message.error;
                            }
                            for (let node of file.previewElement.querySelectorAll("[data-dz-errormessage]"))
                            {
                                node.textContent = message;
                            }
                        }
                    });
    
                });
    
                this.on("totaluploadprogress", function (file,progress) {
                    if (file.previewElement)
                    {
                        var progressElement = file.previewElement.querySelector("[data-dz-uploadprogress]");
                        progressElement.style.width = progress + "%";
    
                        // If we want to add persent 
                        // progressElement.querySelector(".progress-text").textContent = progress + "%";
                    }
                });
            },


        });

    });
}


///::::::::::::::::::::::::::::::::::::::::( DELETE FILE )::::::::::::::::::::::::::::::::::::::::///
$('body').on('click','[data-delete-file]',function (e) {

    // Prevent default
    e.preventDefault();
    let $token            = $(this).attr('data-delete-file');
    let $data_category    = $(this).attr("data-category");
    let $data_category_id = $(this).attr("data-category-id");

    // Stop if not token
    if ( !$token )
    {
        return;
    }

    // Get file block
    let $file  = $(this).closest('.file-block')

    // prep post 
    let $post       = {}
    let $tn         = "_token";
    $post[$tn]      = $varJs['csrf_token'];
    $post['token']  = $token

    // Ajax post 
    $.ajax({
        url:'/upload/delete/'+$token+'/'+$data_category+'/'+$data_category_id,
        type: "post",
        data: { "_token":$varJs['csrf_token'],'token':$token },
        success: ( $data ) =>
        {
            $file.remove();
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
