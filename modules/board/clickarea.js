define([
    "dojo/_base/connect",
    "bgagame/modules/util/backend"
], function (connect, backend) {

    let infos = {};

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

    connect.subscribe("click", this, function (color) {
        let info = infos[color];
        if (info == undefined) {
            return;
        }

        let args = {};
        for (let key in info) {
            args[key] = String(info[key]);
        }
        console.log(args);
        backend.call("click", args);
    });    

    const clickarea = function (path, info) {

        const draw = function (context) {
            if (Array.isArray(path[0])) {
                drawClickPath(context);
            } else if (path.length == 3) {
                drawClickCircle(context);
            } else if (path.length == 4) {
                drawClickRectangle(context);
            }
            infos[color.getColor()] = info;
            color.nextColor();
        }
        
        const drawClickRectangle = function (context) {
            context.fillStyle = color.getColorString();
            context.beginPath();
            context.fillRect(path[0],path[1],path[2], path[3]);
        };
    
        var drawClickCircle = function (context) {
            context.fillStyle = color.getColorString();
            context.beginPath();
            context.moveTo(path[0][0], path[0][1]);
            context.arc(path[0],path[1],path[2], 0, 2 * Math.PI);
            context.fill();
        };
    
        var drawClickPath = function (context) {
            context.fillStyle = color.getColorString();
            context.beginPath();
            context.moveTo(path[0][0], path[0][1]);
            for (var i = 1; i < path.length; i++) {
                if (path[i].length == 2) {
                    context.lineTo(path[i][0], path[i][1]);
                } else {
                    let p = path[i];
                    context.bezierCurveTo(p[0],p[1],p[2],p[3],p[4],p[5]);
                }
            }
            context.fill();
        };        

        return {
            draw: draw
        }
    }

    return clickarea;
});