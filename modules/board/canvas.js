define([
    "bgagame/modules/board/board",
    "bgagame/modules/util/backend"
], function (state, backend) {

    const color = (function () {

        let fillColor = 16777215;

        const getColorString = function () {
            return '#' + Number(fillColor).toString(16).padStart(6, '0');
        };

        const getColor = function () {
            return Number(fillColor).toString(16).padStart(6, '0');
        };

        const nextColor = function () {
            fillColor = fillColor - 1;
        };

        const resetColor = function () {
            fillColor = 16777215;
        }

        return {
            getColorString: getColorString,
            getColor: getColor,
            nextColor: nextColor,
            resetColor: resetColor
        };

    })();    
    
    let table = null;
    let clickarea = null;
    let infos = {};
    let transformations = {};
    
    const viewport = {
        scale: 1.0,
        offset: {
            x: 0,
            y: 0
        }
    };

    const traverse = function* (o, level, path = []) {
        for (let i of Object.keys(o)) {
            const itemPath = path.concat(i);
            if (level > 0) {
                yield* traverse(o[i], level - 1, itemPath);
            } else {
                yield [i, o[i], itemPath]; 
            }
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
        } else {
            canvas.style = "position: absolute";
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
        catchClick(color);
    };

    const createTable = function (element) {
        table = createCanvas(element);
        clickarea = createCanvas(element, true);
        table.canvas.addEventListener('click', publishClick);        
    };
    
    const drawBoard = function () {
        clearTable();
        scale();        
        
        transformations['000'] = table.getTransform();
        recurseGameElements('000');
        
        drawTiles();
        iterateTokens(table, drawPlainToken);

        drawClickAreas();
        iterateTokens(clickarea, drawClickableTokens);
    };

    const clearTable = function () {
        table.setTransform(1, 0, 0, 1, 0, 0);
        clickarea.setTransform(1, 0, 0, 1, 0, 0);
        table.clearRect(0, 0, table.canvas.width, table.canvas.height);
        clickarea.clearRect(0, 0, table.canvas.width, table.canvas.height);
        transformations = {};
    };

    const scale = function () {
        table.scale(viewport.scale, viewport.scale);
        clickarea.scale(viewport.scale, viewport.scale);
    };

    const rotate = function (rotation) {
        table.translate(rotation.x, rotation.y);
        table.rotate(rotation.r);
        table.translate(-rotation.x, -rotation.y);
    };

    const recurseGameElements = function (parent) {
        let tiles = state.getState().board;
        for (let key in tiles) {
            let tile = tiles[key];
            if (tile.parent == parent) {
                table.save();
                rotate(tile.r);
                table.translate(tile.x, tile.y);
                transformations[key] = table.getTransform();
                recurseGameElements(key);
                table.restore();
            }
        }
    };

    const drawTiles = function () {
        let tiles = state.getState().board;
        let tray = state.getState().tray;
        for (let key in tiles) {
            table.setTransform(transformations[key]);
            table.drawImage(tray[key].image, 0, 0);
        }
    };

    const iterateTokens = function (context, callback) {
        const tokens = traverse(state.getState().tokens, 2);
        for (const token of tokens) {
            const tileId = token[2][0];
            const { x, y, r } = token[1].pos;
            context.setTransform(transformations[tileId]);
            context.translate(x, y);
            if (r.r) {
                context.translate(r.x, r.y);
                context.rotate(r.r);
            }
            callback(token);
        }
    };

    const drawPlainToken = function (token) {
        table.drawImage(token[1].image, 0, 0);
    };

    const drawClickableTokens = function (token) {
        const clickable = state.getState().clickable;
        if (clickable[token[2][0]] && clickable[token[2][0]][token[2][1]]) {
            const image = token[1].image;
            drawClickArea([0, 0, image.width, image.height], {
                tileId: token[2][0],
                posId: token[2][2],
                tokenId: token[1].type,
                variantId: token[1].value
            });            
        }
    };    

    const drawClickAreas = function () {
        let clickareas = state.getState().clickareas;
        for (let area in clickareas) {
            for (let i = 0; i < clickareas[area].length; i++) {
                const { path, info } = clickareas[area][i];
                clickarea.setTransform(transformations[area]);
                drawClickArea(path, info);
            }
        }
    };

    const drawClickArea = function (path, info) {
        if (Array.isArray(path[0])) {
            drawClickPath(path, info);
        } else if (path.length == 3) {
            drawClickCircle(path);
        } else if (path.length == 4) {
            drawClickRectangle(path);
        }
        infos[color.getColor()] = info;
        color.nextColor();
    }
    
    const drawClickRectangle = function (path) {
        clickarea.fillStyle = color.getColorString();
        clickarea.beginPath();
        clickarea.fillRect(path[0],path[1],path[2], path[3]);
    };

    var drawClickCircle = function (path) {
        clickarea.fillStyle = color.getColorString();
        clickarea.beginPath();
        clickarea.moveTo(path[0][0], path[0][1]);
        clickarea.arc(path[0],path[1],path[2], 0, 2 * Math.PI);
        clickarea.fill();
    };

    var drawClickPath = function (path) {
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
    };     
    
    const catchClick =  function (color) {
        let info = infos[color];
        if (info == undefined) {
            return;
        }

        let args = {};
        for (let key in info) {
            args[key] = String(info[key]);
        }
        args["all"] = info;
        console.log(args);
        backend.call("click", args);
    };     

    return {
        createTable: createTable,
        drawBoard: drawBoard,
        setScale: setScale
    };

});