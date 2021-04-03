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
                token: token
            }; 
        };
                
        const makeTokensClickable = function () {
            clickableTokens = true;
        };

        const getTokens = function () {
            let list = [];
            for (let key in tokens) {
                token = {
                    image: tokens[key].token.image,
                    x: positions[key].x,
                    y: positions[key].y,
                    rotation: positions[key].rotation
                }
                if (clickableTokens) {
                    token.clickarea = createClickArea(tokens[key].token);
                }
                list.push(token);
            };
            return list;
        };

        const createClickArea = function (token) {
            return clickarea([0, 0, token.image.width, token.image.height], {
                componentId: token.componentId,
                variantId: token.variantId
            });
        };

        return {
            addInsertPositions: addInsertPositions,
            addInsertPosition: addInsertPosition,
            removeAllTokens: removeAllTokens,
            slotTokenInPosition: slotTokenInPosition,
            makeTokensClickable: makeTokensClickable,
            getTokens: getTokens
        };
    };

    const factory = function (componentId, image) {
        
        const overlays = {};

        const tiles = {};

        const clickareas = [];

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
            clickareas.push(clickarea(path, info));
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

        const getChildren = function () {
            let children = [];
            for (let key in tiles) {
                children.push({
                    image: tiles[key].tile.image,
                    x: tiles[key].x,
                    y: tiles[key].y,
                    getChildren: tiles[key].tile.getChildren,
                    getTokens: tiles[key].tile.getTokens,
                    getClickAreas: tiles[key].tile.getClickAreas
                });
            }
            return children;
        };

        const getTokens = function () {
            let tokens = [];
            for (let key in overlays) {
                tokens = tokens.concat(overlays[key].getTokens());
            }
            return tokens;
        };

        const getClickAreas = function () {
            return clickareas;
        };

        return {
            componentId, image,
            addGameTile: addGameTile,
            getGameTile: getGameTile,
            createOverlay: createOverlay,
            getOverlay: getOverlay,
            addClickAreas: addClickAreas,
            addClickArea: addClickArea,
            getChildren: getChildren,
            getTokens: getTokens,
            getClickAreas: getClickAreas
        }    
    }

    return factory;
});