define([
    "dojo/_base/connect",
    "bgagame/modules/board/board"
], function (connect, state) {
    
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
        clickarea = createCanvas(element, true);
        table.canvas.addEventListener('click', publishClick);        
    };
    
    const drawBoard = function () {
        clearTable();
        save();
        scale();        
        recurseGameElements('board');
        restore();       
    };

    const clearTable = function () {
        table.setTransform(1, 0, 0, 1, 0, 0);
        clickarea.setTransform(1, 0, 0, 1, 0, 0);
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
        table.translate(rotation.x, rotation.y);
        clickarea.translate(rotation.x, rotation.y);
        table.rotate(rotation.r);
        clickarea.rotate(rotation.r);
        table.translate(-rotation.x, -rotation.y);
        clickarea.translate(-rotation.x, -rotation.y);
    }

    const recurseGameElements = function (parent) {
        // drawClickAreas(parent.getClickAreas());
        // drawTokens(parent.getTokens());
        let tiles = state.getState().board;
        let tray = state.getState().tray;
        for (let key in tiles) {
            let tile = tiles[key];
            if (tile.parent == parent) {
                save()
                rotate(tile.r);
                table.drawImage(tray[key].image, tile.x, tile.y);
                translate(tile.x, tile.y);
                recurseGameElements(key);
                restore();
            }
        }
    };

    const drawTokens = function (tokens) {
        for (let i = 0; i < tokens.length; i++) {
            save();
            translate(tokens[i].x, tokens[i].y);
            rotate(tokens[i].rotation);
            absoluteposition.registerToken(tokens[i], table);
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