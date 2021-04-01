define([
    "dojo/Deferred",
    "dojo/promise/all"    
], function (Deferred, all) {

  var images = {};  
  var loader = [];

  var addImage = function (id, url) {
    var deferred = new Deferred();
    loader.push(deferred);

    var image = new Image();
    image.crossOrigin = "Anonymous";
    image.addEventListener('load', function() {
        images[id] = image;
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