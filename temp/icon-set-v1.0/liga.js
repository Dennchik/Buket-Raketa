/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
    'use strict';
    function supportsProperty(p) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            i,
            div = document.createElement('div'),
            ret = p in div.style;
        if (!ret) {
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for (i = 0; i < prefixes.length; i += 1) {
                ret = prefixes[i] + p in div.style;
                if (ret) {
                    break;
                }
            }
        }
        return ret;
    }
    var icons;
    if (!supportsProperty('fontFeatureSettings')) {
        icons = {
            'contacts': '&#xe907;',
            'cross-middle': '&#xe944;',
            'trash': '&#xe938;',
            'user-profile': '&#xe971;',
            'information-outline': '&#xe90a;',
            'arrow-thin': '&#xe950;',
            'delivery': '&#xe90b;',
            'angle-left': '&#xf104;',
            'angle-right': '&#xf105;',
            'rouble': '&#xf159;',
            'rub': '&#xf159;',
            'whatsapp': '&#xf232;',
            'vk-brand': '&#xf189;',
            'telegram-fly': '&#xe91b;',
            'phone-call': '&#xe914;',
            'angle-down': '&#xf107;',
            'vk-draw': '&#xe900;',
            'telegram-draw': '&#xe901;',
            'whatsapp-draw': '&#xe902;',
            'local_grocery_store': '&#xe904;',
            'shopping_cart': '&#xe904;',
            'minus': '&#xe908;',
            'plus': '&#xe911;',
            'location': '&#xe909;',
          '0': 0
        };
        delete icons['0'];
        window.icomoonLiga = function (els) {
            var classes,
                el,
                i,
                innerHTML,
                key;
            els = els || document.getElementsByTagName('*');
            if (!els.length) {
                els = [els];
            }
            for (i = 0; ; i += 1) {
                el = els[i];
                if (!el) {
                    break;
                }
                classes = el.className;
                if (/icon-/.test(classes)) {
                    innerHTML = el.innerHTML;
                    if (innerHTML && innerHTML.length > 1) {
                        for (key in icons) {
                            if (icons.hasOwnProperty(key)) {
                                innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
                            }
                        }
                        el.innerHTML = innerHTML;
                    }
                }
            }
        };
        window.icomoonLiga();
    }
}());
