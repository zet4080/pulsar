define([
    "bgagame/modules/board/clickarea"
], function (clickarea) {

    const getSprite = function (simage, sx, sy, swidth, sheight) {
        if (simage && Number.isFinite(sx) && Number.isFinite(sy)) {
            let canvas = document.createElement("canvas");
            canvas.width = swidth;
            canvas.height = sheight;
            let context = canvas.getContext('2d');
            context.drawImage(simage, sx, sy, swidth, sheight, 0, 0, swidth, sheight);
            let image = new Image();
            image.src = canvas.toDataURL("image/webp");
            return image;
        } 
        return simage;
    }

    const overlay = function () {

        const positions = {};

        let tokens = {};
        
        let clickableTokens = false;
        let clickinfo = null;

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
            tokens = {};
        };

        const slotTokenInPosition = function (posid, token) {
            tokens[posid] = [token, positions[posid].x, positions[posid].y, positions[posid].rotation];
        };
                
        const makeTokensClickable = function (info) {
            clickableTokens = true;
            clickinfo = info;
        }

        const draw = function (context) {
            for (let key in tokens) {
                context.save();
                context.translate(tokens[key][1], tokens[key][2]);
                context.rotate(tokens[key][3]);
                tokens[key][0].draw(context);
                context.restore();
            }
        };
        const drawClickableTokens = function (context) {
            if (clickableTokens == false) {
                return;
            }
            for (let key in tokens) {
                context.save();
                context.translate(tokens[key][1], tokens[key][2]);
                context.rotate(tokens[key][3]);
                tokens[key][0].drawClickArea(context, clickinfo);
                context.restore();
            }
        };       

        return {
            addInsertPositions: addInsertPositions,
            addInsertPosition: addInsertPosition,
            removeAllTokens: removeAllTokens,
            slotTokenInPosition: slotTokenInPosition,
            makeTokensClickable: makeTokensClickable,
            draw: draw,
            drawClickableTokens: drawClickableTokens
        };
    };

    const factory = function (simage, sx, sy, swidth, sheight) {
        
        let image = getSprite(simage, sx, sy, swidth, sheight);
        
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

        const addGameTile = function (id, tile, x, y) {
            tiles[id] = { tile, x, y };
        };

        const getGameTile = function (id) {
            return tiles[id].tile;
        };        

        const draw = function (context) {
            if (image) {
                context.drawImage(image, 0, 0);
            }
            for (let i in tiles) {
                context.save();
                context.translate(tiles[i].x, tiles[i].y);
                tiles[i].tile.draw(context);
                context.restore();
            }
            for (let key in overlays) {
                overlays[key].draw(context);
            }
        };

        const drawClickAreas = function (context) {
            for (let key in clickareas) {
                clickareas[key].draw(context);
            }
            for (let i in tiles) {
                context.save();
                context.translate(tiles[i].x, tiles[i].y);
                tiles[i].tile.drawClickAreas(context);
                context.restore();
            }
            for (let key in overlays) {
                overlays[key].drawClickableTokens(context);
            }
        };        
        
        const addClickArea = function (id, path, info) {
            info = info || {};
            info.id = id;
            clickareas[id] = clickarea(path, info);
        };

        const addClickAreas = function (nodes, width, height, info) {
            for (let i = 0; i < nodes.length; i++) {
                if (Number.isFinite(width) && Number.isFinite(height)) {
                    nodes[i][2] = width;
                    nodes[i][3] = height;
                }
                addClickArea(i, nodes[i], info);
            }
        };

        return {
            draw: draw,
            addGameTile: addGameTile,
            getGameTile: getGameTile,
            createOverlay: createOverlay,
            getOverlay: getOverlay,
            addClickAreas: addClickAreas,
            addClickArea: addClickArea,
            drawClickAreas: drawClickAreas
        }    

    }

    return factory;
});