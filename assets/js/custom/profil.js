
if ( $('.user-profil-img-edit').length )
{
    $('.show-dropzone-block').hide();
}
// Hide dropzone block when user already has photo
$('body').on('click','.upie-img-delete',function (e)
{
    $('.user-profil-img-edit').hide();
    $('.show-dropzone-block').show();
})