define([
    "bgagame/modules/board/dispatch",
    "bgagame/modules/board/board",
    "bgagame/modules/board/rotation"
], function (dispatch, board, rotation) {


    const addInsertPositions = function (posarray) {
        for (let i = 0; i < posarray.length; i++) {
            this.addInsertPosition(i, posarray[i][0], posarray[i][1], posarray[i][2]);
        }
        return this;
    };

    const addInsertPosition = function (posid, x, y, r) {
        dispatch("overlay/addinsertposition", {
            tileId: this.tileId,
            name: this.name,
            posid, x, y, r
        });
        return this;
    };       

    const makeTokensClickable = function () {

    };
    
    const slotTokenInPosition = function (posid, token) {
        dispatch("overlay/slottokeninposition", {
            tileId: this.tileId,
            name: this.name,
            posid, token
        });        
    };

    const overlay = {
        addInsertPositions: addInsertPositions,
        addInsertPosition: addInsertPosition,
        makeTokensClickable: makeTokensClickable,
        slotTokenInPosition: slotTokenInPosition
    };

    const overlayfactory = function (tileId, name) {
        return Object.create(overlay, {
            tileId: {
                value: tileId,
                writable: true,
                enumerable: true 
            },
            name: {
                value: name,
                writable: true,
                enumerable: true 
            }
        });
    };

    const addClickArea = function (id, path, info) {
        id = String(id);
        info = info || {
            tileId: this.id
        };
        info.clickAreaId = id;
        dispatch("gametile/addclickarea", {
            source: this.id,
            id, path, info
        });
    };

    const addClickAreas = function (nodes, width, height, info) {
        for (let i = 0; i < nodes.length; i++) {
            let node;
            if (Number.isFinite(width) && Number.isFinite(height)) {
                node = [nodes[i][0], nodes[i][1], width, height];
            } else {
                node = nodes[i];
            }
            this.addClickArea(i, node, info);
        }
    };       

    const addGameTile = function (tile, x, y, r) {
        r = r || rotation(0, 0, 0);
        dispatch("board/addgametile", {
            source: this.id,
            tile, x, y, r
        });
    };

    const createOverlay = function (overlayName) {
        dispatch("gametile/addoverlay", {
            source: this.id,
            name: overlayName
        });        
        return overlayfactory(this.id, overlayName);
    };

    const getOverlay = function (name) {
        return overlayfactory(this.id, name);
    };

    const gametile = {
        addClickArea: addClickArea,
        addClickAreas: addClickAreas,
        addGameTile: addGameTile,
        createOverlay: createOverlay,
        getOverlay: getOverlay
    }; 

    const factory = function () {
        let args = Array.from(arguments);
        let image;
        if (typeof(args[0]) === 'object') {
            image = args.shift();
        }
        let id = args.join("/");

        return Object.create(gametile, {
            id: {
                value: id,
                writable: true,
                enumerable: true 
            },
            image: {
                value: image,
                writable: true,
                enumerable: true 
            }
        });
    };

    return factory;
});