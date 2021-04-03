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
    };

    const clearTable = function () {
        table.clearRect(0, 0, table.canvas.width, table.canvas.height);
        clickarea.clearRect(0, 0, table.canvas.width, table.canvas.height);
    }

    const save = function () {
        table.save();
        clickarea.save();
    }

    const scale = function () {
        table.scale(viewport.scale, viewport.scale);
        clickarea.scale(viewport.scale, viewport.scale);
    }

    const restore = function () {
        table.restore()
        clickarea.restore();
    }

    const translate = function (x, y) {
        table.translate(x, y);
        clickarea.translate(x, y);
    }

    const rotate = function (rotation) {
        table.rotate(rotation);
        clickarea.rotate(rotation);
    }
    
    const drawGameElements = function (board) {
        clearTable();
        save();
        scale();        
        recurseGameElements(board, table);
        restore();        
    };

    const recurseGameElements = function (parent) {
        drawTokens(parent.getTokens());
        drawClickAreas(parent.getClickAreas());
        let tiles = parent.getChildren();
        for (let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];
            table.drawImage(tile.image, tile.x, tile.y);
            save();
            translate(tile.x, tile.y);
            recurseGameElements(tile);
            restore();
        }
    };

    const drawTokens = function (tokens) {
        for (let i = 0; i < tokens.length; i++) {
            save();
            translate(tokens[i].x, tokens[i].y);
            rotate(tokens[i].rotation);
            table.drawImage(tokens[i].image, 0, 0);
            if (tokens[i].clickarea) { tokens[i].clickarea.draw(clickarea) }
            restore();
        }
    };

    const drawClickAreas = function (clickareas) {
        for (let i = 0; i < clickareas.length; i++) {
            clickareas[i].draw(clickarea);
        }
    };

    return {
        createTable: createTable,
        drawBoard: drawBoard,
        setScale: setScale
    };

});