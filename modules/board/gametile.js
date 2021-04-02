define([
    "bgagame/modules/board/clickarea"
], function (clickarea) {

    const overlay = function () {

        const positions = {};

        const tokens = {};
        
        let clickableTokens = false;

        const addInsertPositions = function (posarray) {
            for (let i = 0; i < posarray.length; i++) {
                addInsertPosition(i, posarray[i][0], posarray[i][1], posarray[i][2]);
            }
        };

        const addInsertPosition = function (posid, x, y, rotation) {
            positions[posid] = {
                x, y, 
                rotation: rotation * Math.PI / 180
            };
        };

        const removeAllTokens = function () {
            for (let key in tokens) {
                delete tokens[key];
            }
        };

        const slotTokenInPosition = function (posid, token) {
            tokens[posid] = { 
                x: positions[posid].x,
                y: positions[posid].y,
                rotation: positions[posid].rotation,
                token: token
            }; 
        };
                
        const makeTokensClickable = function () {
            clickableTokens = true;
        }

        return {
            tokens,
            addInsertPositions: addInsertPositions,
            addInsertPosition: addInsertPosition,
            removeAllTokens: removeAllTokens,
            slotTokenInPosition: slotTokenInPosition,
            makeTokensClickable: makeTokensClickable
        };
    };

    const factory = function (componentId, image) {
        
        const overlays = {};

        const tiles = {};

        const clickareas = {};

        const createOverlay = function (overlayName) {
            overlays[overlayName] = overlay();
            return overlays[overlayName];
        };

        const getOverlay = function (overlayName) {
            return overlays[overlayName];
        };

        const addGameTile = function (tile, x, y) {
            tiles[tile.componentId] = { 
                tile, x, y
            };
        };

        const getGameTile = function (id) {
            return tiles[id].tile;
        };  
        
        const addClickArea = function (id, path, info) {
            info = info || {
                componentId: componentId
            };
            info.clickAreaId = id;
            clickareas[id] = clickarea(path, info);
        };

        const addClickAreas = function (nodes, width, height, info) {
            for (let i = 0; i < nodes.length; i++) {
                if (Number.isFinite(width) && Number.isFinite(height)) {
                    node = [nodes[i][0], nodes[i][1], width, height];
                } else {
                    node = nodes[i];
                }
                addClickArea(i, node, info);
            }
        };

        return {
            componentId, image, tiles, overlays, clickareas,
            addGameTile: addGameTile,
            getGameTile: getGameTile,
            createOverlay: createOverlay,
            getOverlay: getOverlay,
            addClickAreas: addClickAreas,
            addClickArea: addClickArea
        }    

    }

    return factory;
});