define([
    "dojo/dom-style"
], function (style) {
    var markerPos = {
        1:  { top: 306, left: 119, deg: -36 },
        2:  { top: 237, left: 181, deg: -24 },
        3:  { top: 248, left: 246, deg: -19 },
        4:  { top: 228, left: 311, deg:  -8 },
        5:  { top: 217, left: 380, deg:  -3 },
        6:  { top: 213, left: 448, deg:   0 },
        7:  { top: 217, left: 518, deg:   7 },
        8:  { top: 230, left: 583, deg:  21 },
        9:  { top: 248, left: 650, deg:  26 },
        10: { top: 274, left: 714, deg:  32 },
        11: { top: 307, left: 775, deg:  39 }
    };

    var setMarker = function (pos) {
        var marker = $("marker");
        style.set(marker, {
            top: markerPos[pos].top + "px",
            left: markerPos[pos].left + "px",
            transform: "rotate(" + markerPos[pos].deg + "deg)"
        });
    }

    return setMarker;

});