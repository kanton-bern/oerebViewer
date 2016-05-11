$(function() {
    console.log('loaded');
});

// Menubutton in header will change to cross [x] if menu is open.
var $contentWrapper = $('.content-wrapper');
var $panel = $('#menuLeftSlider');

console.log($panel.attr('aria-expanded'));

if ($('#menuLeftSlider').is(':visible')) {
  // Foundation.Motion.animateOut($panel, 'slide-out-left');

};


$(window).on('load resize', function() {
        // Create breakpoint body.class
        // https://github.com/zurb/foundation/issues/5139
        console.log(Foundation.MediaQuery.current);
});
