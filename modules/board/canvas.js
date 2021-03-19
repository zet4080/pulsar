define([
    "dojo/_base/connect",
    "bgagame/modules/util/backend",
], function (connect, backend) {
    
    var table;
    var clickarea;

    var clickAreaInfos = {};

    var color = (function () {
        let fillColor = 16777215;

        var getColorString = function () {
            return '#' + Number(fillColor).toString(16);
        };

        var getColor = function () {
            return Number(fillColor).toString(16);
        };

        var nextColor = function () {
            fillColor = fillColor - 10;
        };

        var reset = function () {
            fillColor = 16777215;
        };

        var getColorFromPixel = function (pixel) {
            return Number(pixel[0]).toString(16) + Number(pixel[1]).toString(16) + Number(pixel[2]).toString(16);
        };

        return {
            getColorString: getColorString,
            getColor: getColor,
            nextColor: nextColor,
            reset: reset,
            getColorFromPixel: getColorFromPixel
        };
    })();

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

    var iterateClickableTokens = function (board, fct) {
        let elements = board.getAllGameTiles();
        for (let elem in elements) {
            let e = elements[elem].getProperties();
            let clickableTokens = elements[elem].getClickableTokens();
            let tokens = elements[elem].getAllTokens();
            for (let t in clickableTokens) {    
                let token = tokens[t];
                for(var posid in token) {
                    fct(token[posid], e.x, e.y, e.rotation);
                }
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
        clickAreaInfos = {};
        color.reset();

        clickarea.clearRect(0, 0, table.canvas.width, table.canvas.height);
        clickarea.save();            
        clickarea.scale(viewport.scale, viewport.scale);

        drawClickAreas(board);
        drawClickableTokens(board);

        clickarea.restore();
    };

    var drawClickAreas = function (board) {
        iterateClickAreas(board, function (path, info, x, y) {
            drawClickPath(path, info, x, y);
        });
    };

    var drawClickableTokens = function (board) {
        iterateClickableTokens(board, function (token, x, y, rotation) {
            let tx = token.x;
            let ty = token.y;
            let tw = token.swidth || token.image.width;
            let th = token.sheight || token.image.height;

            let path = [[tx, ty], [tx + tw, ty], [tx + tw, ty + th], [tx, ty + th]];
            let info = {
                tileId: token.tileId,
                tokenId: token.tokenId,
                posId: token.posId,
                variantId: token.variantId
            };
            drawClickArea(path, info, x, y);
        });
    };

    var drawClickArea = function (path, info, x, y) {
        if (Array.isArray(path[0])) {
            drawClickPath(path, info, x, y);
        } else {
            drawClickCircle(path, info, x, y);
        }
    };

    var drawClickCircle = function (path, info, x, y) {
        clickarea.save();
        clickarea.translate(x, y);
        clickarea.fillStyle = color.getColorString();
        clickarea.beginPath();
        clickarea.moveTo(path[0][0], path[0][1]);
        clickarea.arc(path[0],path[1],path[2], 0, 2 * Math.PI);
        clickarea.fill();
        clickAreaInfos[color.getColor()] = info;
        color.nextColor();
        clickarea.restore();

    };

    var drawClickPath = function (path, info, x, y) {
        clickarea.save();
        clickarea.translate(x, y);
        clickarea.fillStyle = color.getColorString();
        clickarea.beginPath();
        clickarea.moveTo(path[0][0], path[0][1]);
        for (var i = 1; i < path.length; i++) {
            if (path[i].length == 2) {
                clickarea.lineTo(path[i][0], path[i][1]);
            } else {
                let p = path[i];
                clickarea.bezierCurveTo(p[0],p[1],p[2],p[3],p[4],p[5]);
            }
        }
        clickarea.fill();
        clickAreaInfos[color.getColor()] = info;
        color.nextColor();
        clickarea.restore();
    };

    var setScale = function (scale) {
        viewport.scale = scale;
    };

    var createCanvas = function (element, nodisplay) {
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

    var publishClick = function (e) {
        const pixel = clickarea.getImageData(e.offsetX, e.offsetY, 1, 1).data;
        const c = color.getColorFromPixel(pixel);
        let info = clickAreaInfos[c];
        if (info) {
            connect.publish('click', info);
        }
    };

    var createTable = function (element) {
        table = createCanvas(element);
        clickarea = createCanvas(element, true);
        table.canvas.addEventListener('click', publishClick);
    };

    connect.subscribe("click", this, function (info) {
        let args = {
            tileId: String(info.tileId),
        };
        if (info.tokenId) {
            args['tokenId'] = String(info.tokenId);
            args['posId'] = String(info.posId);
            args['variantId'] = String(info.variantId);
        }
        if (info.id) {
            args['clickAreaId'] = String(info.id);
        }
        backend.call("click", args);
    });


    return {
        createTable: createTable,
        drawBoard: drawBoard,
        setScale: setScale
    };
});