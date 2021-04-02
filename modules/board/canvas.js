define([
    "dojo/_base/connect"
], function (connect, when) {
    
    let table = null;
    let clickarea = null;
    
    const viewport = {
        scale: 1.0,
        offset: {
            x: 0,
            y: 0
        }
    };
    
    const getColorFromPixel = function (pixel) {
        return Number(pixel[0]).toString(16).padStart(2, '0') + Number(pixel[1]).toString(16).padStart(2, '0') + Number(pixel[2]).toString(16).padStart(2, '0');
    };

    const setScale = function (scale) {
        viewport.scale = scale;
    };        
    
    const createCanvas = function (element, nodisplay) {
        var parent = $(element);
        var canvas = document.createElement("canvas");
        if (nodisplay) {
            canvas.style = "display: none;";
        }
        parent.appendChild(canvas);
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        var context = canvas.getContext('2d');
        return context;
    };   
    
    const publishClick = function (e) {
        const pixel = clickarea.getImageData(e.offsetX, e.offsetY, 1, 1).data;
        const color = getColorFromPixel(pixel);
        connect.publish('click', color);
    };

    const createTable = function (element) {
        table = createCanvas(element);
        clickarea = createCanvas(element);
        table.canvas.addEventListener('click', publishClick);        
    };
    
    const drawBoard = function (board) {
        drawGameElements(board);
        drawClickCanvas(board);
    };
    
    const drawGameElements = function (board) {
        table.clearRect(0, 0, table.canvas.width, table.canvas.height);
        table.save();            
        table.scale(viewport.scale, viewport.scale);
        recurseGameElements(board.overlays, board.tiles, table);
        table.restore();        
    };

    const recurseGameElements = function (overlays, tiles, table) {
        drawTokens(overlays, table);
        for (let key in tiles) {
            let tile = tiles[key];
            table.drawImage(tile.tile.image, tile.x, tile.y);
            table.save();
            table.translate(tile.x, tile.y);
            recurseGameElements(tile.tile.overlays, tile.tile.tiles, table);
            table.restore();
        }
    };

    const drawTokens = function (overlays, table) {
        for (let key in overlays) {
            let tokens = overlays[key].tokens
            for (let pos in tokens) {
                table.save();
                table.translate(tokens[pos].x, tokens[pos].y);
                table.rotate(tokens[pos].rotation);
                table.drawImage(tokens[pos].token.image, 0, 0);
                table.restore();
            }
        }
    };
    
    const drawClickCanvas = function (board) {
        clickAreaInfos = {};
        clickarea.clearRect(0, 0, table.canvas.width, table.canvas.height);
        clickarea.save();            
        clickarea.scale(viewport.scale, viewport.scale);
        recurseClickElements(board.clickareas, board.overlays, board.tiles, clickarea);
        clickarea.restore();
    };

    const recurseClickElements = function (clickareas, overlays, tiles, table) {
        for (let key in clickareas) { clickareas[key].draw(table); };
        for (let key in tiles) {
            let tile = tiles[key];
            table.save();
            table.translate(tile.x, tile.y);
            recurseClickElements(tile.tile.clickareas, tile.tile.overlays, tile.tile.tiles, table);
            table.restore();
        }        
    }

    const drawClickAreas = function (overlays, table) {
        for (let key in overlays) {
            let tokens = overlays[key].clickareas;
            for (let pos in tokens) {
                table.save();

                table.restore();
            }
        }        
    }

    return {
        createTable: createTable,
        drawBoard: drawBoard,
        setScale: setScale
    };

});