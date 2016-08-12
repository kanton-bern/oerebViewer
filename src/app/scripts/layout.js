$(function() {
    console.log('loaded');
});


// if iOS
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    document.querySelector('html').className = 'no-vh-support';
}


$(window).on('load resize', function() {
        // Create breakpoint body.class
        // https://github.com/zurb/foundation/issues/5139
        console.log(Foundation.MediaQuery.current);
});
