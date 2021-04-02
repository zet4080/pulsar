define([
    "dojo/Deferred",
    "dojo/promise/all",
], function (Deferred, all) {

  const images = {};  
  const loader = [];

  const getSprite = function (deferred, id, variant, simage, sx, sy, swidth, sheight) {
    if (simage && Number.isFinite(sx) && Number.isFinite(sy)) {
        let canvas = document.createElement("canvas");
        canvas.width = swidth;
        canvas.height = sheight;
        let context = canvas.getContext('2d');
        context.drawImage(simage, sx, sy, swidth, sheight, 0, 0, swidth, sheight);
        let image = new Image();
        image.addEventListener('load', function() {
            images[id][variant] = image;
            deferred.resolve(image);
        }, false);            
        image.src = canvas.toDataURL("image/webp");
    } 
  }  

  const addImage = function (id, url, sprites) {
    var deferred = new Deferred();
    
    if (sprites) {
      images[id] = {};
      for (let key in sprites) {
        let def = new Deferred();
        sprites[key].push(def);
        loader.push(def);
      }
    }

    loader.push(deferred);

    var image = new Image();

    image.crossOrigin = "Anonymous";
    image.addEventListener('load', function() {
        if (!sprites) {
          images[id] = image;
        } else {
          for (let key in sprites) {
            let s = sprites[key];
            getSprite(s[4], id, key, image, s[0], s[1], s[2], s[3]);          
          }          
        }
        deferred.resolve(image);
    }, false);            
    image.src = g_gamethemeurl + url;

  };

  var loadImages = function () {
    return all(loader).then(function() {
        return images;
    });
  };

  return {
      addImage: addImage,
      loadImages: loadImages,
  };
});