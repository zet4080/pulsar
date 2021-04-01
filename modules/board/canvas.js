define([
    "dojo/_base/connect",
    "bgagame/modules/util/backend"
], function (connect, backend) {
    
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
        board.draw(table);
        table.restore();        
    };
    
    const drawClickCanvas = function (board) {
        clickAreaInfos = {};
        clickarea.clearRect(0, 0, table.canvas.width, table.canvas.height);
        clickarea.save();            
        clickarea.scale(viewport.scale, viewport.scale);
        board.drawClickAreas(clickarea);
        clickarea.restore();
    };

    return {
        createTable: createTable,
        drawBoard: drawBoard,
        setScale: setScale
    };

});