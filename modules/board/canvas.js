define([
    "dojo/_base/connect"
], function (connect) {
    
    var table;
    var clickarea;

    var clickAreaInfos = {};

    var viewport = {
        scale: 1.0,
        offset: {
            x: 0,
            y: 0
        }
    };

    var iterateTiles = function (board, fct) {
        let elements = board.getAllGameTiles();
        for (let elem in elements) {
            let e = elements[elem].getProperties();
            let t = elements[elem].getAllTokens();
            fct(e.image, e.x, e.y, e.rotation, t);
        }
    };

    var iterateTokens = function (tokens, fct) {
        for (let token in tokens) {
            for (let i in tokens[token]) {
                let t = tokens[token][i];
                fct(t);
            }
        }
    };

    var iterateClickAreas = function (board, fct) {
        let elements = board.getAllGameTiles();
        for (let elem in elements) {
            let e = elements[elem].getProperties();
            let areas = elements[elem].getAllClickAreas();
            for (let area in areas) {
                areas[area].info["tileId"] = elem;
                fct(areas[area].path, areas[area].info, e.x, e.y, e.rotation);
            }
        }
    };    

    var drawToken = function (context, token) {
        if (token.sx == undefined || token.sx == null) {
            context.drawImage(token.image, 0, 0);
        } else {
            context.drawImage(token.image, token.sx, token.sy, token.swidth, token.sheight, 0, 0, token.swidth, token.sheight);                
        }
    };    

    var drawBoard = function (board) {
        drawGameElements(board);
        drawClickCanvas(board);
    };

    var drawGameElements = function (board) {
        table.clearRect(0, 0, table.canvas.width, table.canvas.height);
        table.save();            
        table.scale(viewport.scale, viewport.scale);
        iterateTiles(board, function (image, x, y, rotation, tokens) {
            table.save();
            table.translate(x, y);
            table.drawImage(image, 0, 0);
            iterateTokens(tokens, function (token) {
                table.save();
                table.translate(token.x, token.y);
                table.rotate(token.rotation);
                drawToken(table, token);
                table.restore();
            });
            table.restore();
        });
        table.restore();
    };

    var drawClickCanvas = function (board) {
        let color = 16777215;
        clickAreaInfos = {};

        clickarea.clearRect(0, 0, table.canvas.width, table.canvas.height);
        clickarea.save();            
        clickarea.scale(viewport.scale, viewport.scale);
        iterateClickAreas(board, function (path, info, x, y) {
            clickarea.save();
            clickarea.translate(x, y);
            let fillColor = Number(color).toString(16);
            clickarea.fillStyle = '#' + fillColor;
            clickarea.beginPath();
            clickarea.moveTo(path[0][0], path[0][1]);
            for (var i = 1; i < path.length; i++) {
                clickarea.lineTo(path[i][0], path[i][1]);
            }
            clickarea.fill();
            clickAreaInfos[fillColor] = info;
            color = color - 10;
            clickarea.restore();
        });
        clickarea.restore();
    };

    var setScale = function (scale) {
        viewport.scale = scale;
    };

    var createCanvas = function (element, color) {
        var parent = $(element);
        var canvas = document.createElement("canvas");
        canvas.style = "border: solid " + color + " 3px";
        parent.appendChild(canvas);
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        var context = canvas.getContext('2d');
        return context;
    };   

    var publishClick = function (e) {
        const pixel = clickarea.getImageData(e.offsetX, e.offsetY, 1, 1).data;
        const color = Number(pixel[0]).toString(16) + Number(pixel[1]).toString(16) + Number(pixel[2]).toString(16);
        let info = clickAreaInfos[color];
        if (info) {
            connect.publish('click/' + info.tileId, info);
        }
    };

    var createTable = function (element) {
        table = createCanvas(element, "blue");
        clickarea = createCanvas(element, "yellow");
        table.canvas.addEventListener('click', publishClick);
    };

    return {
        createTable: createTable,
        drawBoard: drawBoard,
        setScale: setScale
    };
});