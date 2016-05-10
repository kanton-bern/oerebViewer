$(function() {
    console.log('loaded');
});

// Menubutton in header will change to cross [x] if menu is open.
$contentWrapper = $('.content-wrapper');
$panel = $('#menuLeftSlider');
if ($panel.is(':visible')) {
  // Foundation.Motion.animateOut($panel, 'slide-out-left');
  console.log("Clicked");
}


$(window).on('load resize', function() {
        // Create breakpoint body.class
        // https://github.com/zurb/foundation/issues/5139
        console.log(Foundation.MediaQuery.current);
})
