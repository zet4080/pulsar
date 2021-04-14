define([
    "bgagame/modules/board/clickarea"
], function (clickarea) {

    const overlay = function (gametile) {

        const positions = {};

        const tokens = {};
        
        let clickableTokens = false;

        const addInsertPositions = function (posarray) {
            for (let i = 0; i < posarray.length; i++) {
                addInsertPosition(i, posarray[i][0], posarray[i][1], posarray[i][2]);
            }
            return that;
        };

        const addInsertPosition = function (posid, x, y, rotation) {
            posid = String(posid);
            positions[posid] = {
                x, y, 
                rotation: rotation * Math.PI / 180
            };
            return that;
        };

        const removeAllTokens = function () {
            for (let key in tokens) {
                delete tokens[key];
            }
        };

        const slotTokenInPosition = function (posid, token) {
            posid = String(posid);
            if (!positions[posid]) {
                throw Error("There is no position with id " + posid);
            }
            if (token.createOverlay) {
                gametile.addGameTile(token, positions[posid].x, positions[posid].y);
            } else {
                tokens[posid] = { 
                    token: token
                }; 
            }
        };
                
        const makeTokensClickable = function () {
            clickableTokens = true;
            return that;
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
                    token.clickarea = createClickArea(tokens[key].token, key);
                }
                list.push(token);
            };
            return list;
        };

        const createClickArea = function (token, posid) {
            posid = String(posid);
            return clickarea([0, 0, token.image.width, token.image.height], {
                tileId: gametile.componentId,
                posId: posid,
                tokenId: token.componentId,
                variantId: token.variantId
            });
        };

        const isPositionOccupied = function (pos) {
            pos = String(pos);
            return tokens[pos] ? true : false;
        }; 

        const removeTokenFromPosition = function (pos) {
            pos = String(pos);
            delete tokens[pos];
        }

        const getFreePositions = function () {
            let list = [];
            for (let key in positions) {
                if (!token[key]) {
                    list.push(key);
                }
            }
            return list;
        };

        const that = {
            isPositionOccupied: isPositionOccupied,
            addInsertPositions: addInsertPositions,
            addInsertPosition: addInsertPosition,
            removeAllTokens: removeAllTokens,
            slotTokenInPosition: slotTokenInPosition,
            makeTokensClickable: makeTokensClickable,
            getTokens: getTokens,
            getFreePositions: getFreePositions,
            removeTokenFromPosition: removeTokenFromPosition
        };

        return that;
    };

    const factory = function (componentId, image) {
        
        const overlays = {};

        const tiles = {};

        const clickareas = [];

        const createOverlay = function (overlayName) {
            overlays[overlayName] = overlay(that);
            return overlays[overlayName];
        };

        const getOverlay = function (overlayName) {
            let overlay = overlays[overlayName];
            if (!overlay) {
                throw Error("Overlay with name " + overlayName + " does not exist!");
            }
            return overlay;
        };

        const addGameTile = function (tile, x, y, rotation) {
            rotation = rotation || { x: 0, y: 0, r: 0 };
            rotation.r = rotation.r * Math.PI / 180;
            tiles[tile.componentId] = { 
                tile, x, y, rotation
            };
        };

        const getGameTile = function (id) {
            id = String(id);
            let tile = tiles[id].tile;
            if (!tile) {
                throw Error("Gametile with name " + id + " does not exist!");
            }
            return tile;
        };  
        
        const addClickArea = function (id, path, info) {
            id = String(id);
            info = info || {
                tileId: componentId
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
                    rotation: tiles[key].rotation,
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

        const that = {
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

        return that;
    }

    return factory;
});