;
(function() {
    jQuery(document).ready(function($) {
        "use strict"; // use strict to start



        $("#header").load("header.html");
        $("#footer").load("footer.html");


        /******* Fixednav scroll *******/
        jQuery(window).scroll(function() {
            var vheight = $(window).height();
            var winwidth = $(window).width();
            if ($(window).scrollTop() > 0) {
                $('.navbar-fixed-top').addClass('sticky');
            } else {
                $('.navbar-fixed-top').removeClass('sticky');
            }
        });

        /******* Magnify Popup *******/
        if (jQuery('.popup-link').length) {
            jQuery('.popup-link').magnificPopup({
                type: 'image',
                gallery: {
                    enabled: true
                }
            });
        }
        if (jQuery('.iframe-popup-link').length) {
            jQuery('.iframe-popup-link').magnificPopup({
                type: 'iframe',
                gallery: {
                    enabled: true
                }
            });
        }


        //Responsive Dropdown menu
        var $window = $(window),
            $html = $('html');

        $window.resize(function resize() {
            if ($window.width() < 992) {
                return $html.addClass('mobile');
            }

            $html.removeClass('mobile');
        }).trigger('resize');



    });
})(jQuery);