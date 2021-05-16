define([
    "bgagame/modules/board/dispatch",
    "bgagame/modules/board/nextid",
    "bgagame/modules/board/rotation",
    "bgagame/modules/board/board"
], function (dispatch, nextid, rotation, board) {


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
            r: rotation(0, 0, r),
            posid, x, y
        });
        return this;
    };       

    const makeTokensClickable = function () {
        dispatch("overlay/maketokensclickable", {
            tileId: this.tileId,
            overlay: this.name
        });
    };
    
    const slotTokenInPosition = function (posid, token) {
        dispatch("overlay/slottokeninposition", {
            tileId: this.tileId,
            name: this.name,
            posid, token
        });        
    };

    const slotGameTileInPosition = function (posid, gametile) {
        dispatch("overlay/slotgametileinposition", {
            tileId: this.tileId,
            name: this.name,
            posid, gametile
        });        
    };    

    const removeAllTokens = function () {
        dispatch("overlay/removealltokens", {
            tileId: this.tileId,
            overlay: this.name
        });
    };

    const removeTokenFromPosition = function (position) {
        dispatch("overlay/removetokenfromposition", {
            tileId: this.tileId,
            overlay: this.name,
            position: position
        });
    };

    const isPositionOccupied = function isPositionOccupied (pos) {
        let tile = board.getState().tokens[this.tileId];
        let overlay = tile && tile[this.name];
        let position = overlay && overlay[pos];
        return position ? true : false;
    };

    const overlay = {
        addInsertPositions: addInsertPositions,
        addInsertPosition: addInsertPosition,
        makeTokensClickable: makeTokensClickable,
        slotTokenInPosition: slotTokenInPosition,
        slotGameTileInPosition: slotGameTileInPosition,
        removeAllTokens: removeAllTokens,
        removeTokenFromPosition: removeTokenFromPosition,
        isPositionOccupied: isPositionOccupied
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
        info = {
            ...info,
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

    const factory = function (image) {
        return Object.create(gametile, {
            id: {
                value: nextid(),
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