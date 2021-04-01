define([
    "bgagame/modules/board/clickarea"
], function (clickarea) {

    const getSprite = function (simage, sx, sy, swidth, sheight) {
        if (simage && Number.isFinite(sx) && Number.isFinite(sy)) {
            let canvas = document.createElement("canvas");
            canvas.width = swidth;
            canvas.height = sheight;
            let context = canvas.getContext('2d');
            context.drawImage(simage, sx, sy, swidth, sheight, 0, 0, swidth, sheight);
            let image = new Image();
            image.src = canvas.toDataURL("image/webp");
            return image;
        } 
        return simage;
    }

    const factory = function (simage, sx, sy, swidth, sheight) {

        let image = getSprite(simage, sx, sy, swidth, sheight);

        const draw = function (context) {
            context.drawImage(image, 0, 0);
        };

        const drawClickArea = function (context) {
            clickarea([0, 0, swidth, sheight]).draw(context);
        }

        return {
            draw: draw,
            drawClickArea: drawClickArea
        }
    };

    return factory;

});