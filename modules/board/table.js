define([

], function () {
    
    var createCamera = function (ctxId, image) {
        
        var settings;
        var distance = 650.0;
        var lookAt = [300, 500];
        var context;
        var fieldOfView;
        var img;
        var viewport = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: 0,
            height: 0,
            scale: [1.0, 1.0]
        };

        var applyScale = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.save();
            context.scale(viewport.scale[0], viewport.scale[1]);
        }
    
        var applyTranslation = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.save();
            context.translate(-viewport.left, -viewport.top);
            context.drawImage(img, 0, 0);
            context.restore();
        }
    
        var updateViewport = function () {
            aspectRatio = context.canvas.width / context.canvas.height;
            viewport.width = distance * Math.tan(fieldOfView);
            viewport.height = viewport.width / aspectRatio;
            viewport.left = lookAt[0] - (viewport.width / 2.0);
            viewport.top = lookAt[1] - (viewport.height / 2.0);
            viewport.right = viewport.left + viewport.width;
            viewport.bottom = viewport.top + viewport.height;
            viewport.scale[0] = context.canvas.width / viewport.width;
            viewport.scale[1] = context.canvas.height / viewport.height;
        }
    
        var zoomTo = function (z) {
            distance = z;
            updateViewport();
            applyScale();
        }
    
        var moveTo = function (x, y) {
            lookAt[0] = x;
            lookAt[1] = y;
            updateViewport();
        }
    
        var screenToWorld = function (x, y, obj) {
            obj = obj || {};
            obj.x = (x / viewport.scale[0]) + viewport.left;
            obj.y = (y / viewport.scale[1]) + viewport.top;
            return obj;
        }
    
        var worldToScreen = function (x, y, obj) {
            obj = obj || {};
            obj.x = (x - viewport.left) * (viewport.scale[0]);
            obj.y = (y - viewport.top) * (viewport.scale[1]);
            return obj;
        }

        var rotate = function () {
            context.rotate(20 * Math.PI / 180);
            context.drawImage(img, viewport.top, viewport.left);
        }
    
        var addListeners = function () {
            // Zoom and scroll around world
            window.onwheel = e => {
                if (e.ctrlKey) {
                    // Your zoom/scale factor
                    let zoomLevel = distance - (e.deltaY * 20);
                    if (zoomLevel <= 1) {
                        zoomLevel = 1;
                    }
    
                    zoomTo(zoomLevel);
                } else {
                    // Your track-pad X and Y positions
                    const x = lookAt[0] + (e.deltaX * 2);
                    const y = lookAt[1] + (e.deltaY * 2);
    
                    moveTo(x, y);
                }
            };
    
            // Center camera on "R"
            window.addEventListener('keydown', e => {
                if (e.key === 'r') {
                    zoomTo(1000);
                    moveTo(0, 0);
                }
            });
        };            

        var canvas = document.getElementById(ctxId);
        context = canvas.getContext('2d');

        img = new Image();   // Create new img element
        img.addEventListener('load', function() {
            context.canvas.width  = canvas.parentNode.clientWidth;
            context.canvas.height = canvas.parentNode.clientHeight;
            applyScale();
            applyTranslation();
        }, false);
        img.src = g_gamethemeurl + image;

        settings = settings || {};
        fieldOfView = settings.fieldOfView || Math.PI / 4.0;
        addListeners();
        updateViewport();
        
        return {
            applyScale: applyScale,
            applyTranslation: applyTranslation,
            updateViewport: updateViewport,
            zoomTo: zoomTo,
            moveTo: moveTo,
            screenToWorld: screenToWorld,
            worldToScreen: worldToScreen,
            rotate: rotate
        }

    };

    return function (ctxId, image) {
        return createCamera(ctxId, image);
    };

});