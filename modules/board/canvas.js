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
        catchClick(color);
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
        recurseGameElements('000');
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
        drawClickAreas(parent);
        drawTokens(parent);
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

    const drawImage = function(tileId, overlay, tokenId, posId, image) {
        let token = state.getState().tray[tokenId];
        table.drawImage(image, 0, 0);
        if (state.getState().clickable[tileId] && state.getState().clickable[tileId][overlay]) {
            drawClickArea([0, 0, image.width, image.height], {
                tileId: tileId,
                posId: posId,
                tokenId: token.type,
                variantId: token.value
            }); 
        }
    }

    const drawTokens = function (parent) {
        let  overlays = state.getState().tokens[parent];
        for (let key in overlays) {
            let tokens = overlays[key];
            for (let posid in tokens) {
                const { image, id } = tokens[posid];
                const {x, y, r} = tokens[posid].pos;
                save();
                translate(x, y);
                rotate(r);
                drawImage(parent, key, id, posid, image);
                restore();
            }
        }
    };

    const drawClickAreas = function (parent) {
        let clickareas = state.getState().clickareas[parent];
        for (let key in clickareas) {
            let area = clickareas[key];
            drawClickArea(area.path, area.info);
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