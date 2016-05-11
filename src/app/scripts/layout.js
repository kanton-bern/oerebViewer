$(function() {
    console.log('loaded');
});


$(window).on('load resize', function() {
        // Create breakpoint body.class
        // https://github.com/zurb/foundation/issues/5139
        console.log(Foundation.MediaQuery.current);
});
