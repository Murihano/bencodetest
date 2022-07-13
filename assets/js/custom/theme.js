// If user has system type in db
function addSpaceImg( colorTheme )
{
    $('body').attr('data-layout-color', colorTheme);
    $('img[class^="svg-theme"]').each(function (e) {
        let $svg_src =  $(this).data('root-src');
        $svg_src = $svg_src + colorTheme+'.svg';
        $(this).attr('src', $svg_src );
    })
}

if ( $('body').data('layout-color') == 'system' )
{
    if(window.matchMedia("(prefers-color-scheme: dark)").matches )
    {
        colorTheme = 'dark';
    }
    else
    {
        colorTheme = 'light';
    }

    addSpaceImg(colorTheme);
}
