$(function() {
    console.log('loaded');
});


// if iOS
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    document.querySelector('html').className = 'no-vh-support';
}

// Firefox on Mobile
function detectAndroidFirefox () {
   var agent = navigator.userAgent.toLowerCase();
   return (agent.indexOf('firefox') + agent.indexOf("android")) >= 0;
}

if(detectAndroidFirefox()) {
  alert("Diese Applikation funktioniert aus Performance-Gründen nicht mit dem Firefox-Browser. Bitte benutzen Sie einen anderen Browser.\n\nThis application does not work with the Firefox browser for performance reasons. Please use another browser.\n\nCette application ne fonctionne pas avec le navigateur Firefox pour des raisons de performances. S'il vous plaît utiliser un autre navigateur.");
}

$(window).on('load resize', function() {
        // Create breakpoint body.class
        // https://github.com/zurb/foundation/issues/5139
        //console.log(Foundation.MediaQuery.current);
});
