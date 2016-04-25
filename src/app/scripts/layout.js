// jQuery
// var $ = require('./vendor/jquery.min.js');
var global = {};
global.jQuery = $;
//require('./vendor/what-input.min.js'); - included by bower
//require('./vendor/svgxuse.min.js'); - included by bower

$(function() {

    // Bottom slider
    $bottomSlider = $('.position-bottom');
    $buttonSlider = $('#themeBottomToggler');
    $btnOpenTheme = $('#themeBottomToggler');
    $themeTitle = $('.slide-title');
    var vHeight = $(window).height() - 40;


    $btnOpenTheme.click(function() {
        var topBarHeight = $('.header-sticky-container').height();
        if($bottomSlider.hasClass("slider-active")) {
            $bottomSlider.animate({
                    top:vHeight
                }, {
                    duration:400
                }

            );
            // Modifying the title of the theme
            $themeTitle.css("margin-top","1em");
            $themeTitle.css("opacity","0.5");

        }
        if($bottomSlider.hasClass("slider-inactive")) {
            $bottomSlider.animate({
                    top:topBarHeight
                }, {
                    duration:400
                }
            );
            // Modifying the title of the theme
            $themeTitle.css("margin-top","3em");
            $themeTitle.css("opacity","1");
        }
        $bottomSlider.toggleClass("slider-active");
        $bottomSlider.toggleClass("slider-inactive");

    });
    // End bottom slideer

    // open autocomplete field
    $(".autocomplete").hide();
    $(".searchbox").focusin(function() {
        $(".autocomplete").slideDown('medium');
    }).focusout(function () {
        $(".autocomplete").slideUp('medium');
    });

    // Stop Searchbox


    // Some prototype dummy functions
    // Hide and show map or theme maps
    $('.btnSearch').click(function() {
        $('.theme-map').toggleClass('oereb-fade-out');
    });

    // Show spinner



    // Hide or show the Notifications
    $('.btnGetLocation').click(function() {
        $('.notification-wrapper').toggleClass('oereb-fade-out');
    });
});

$(window).on('load resize', function() {
    // Create breakpoint body.class
    // https://github.com/zurb/foundation/issues/5139
    console.log(Foundation.MediaQuery.current);
});