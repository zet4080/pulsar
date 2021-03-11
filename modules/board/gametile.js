define([
    "bgagame/modules/board/token"
], function (token) {
    var factory = function (properties) {
       
        var tokens = {};
        var positions = {};
        var tokensOnTile = {};
        var clickareas = {};

        var dummy = {
            x: 0, y: 0, rotation: 0
        };

        var addTokenPosition = function (tokenId, positionId, x, y, rotation) {
            if (!positions[tokenId]) {
                positions[tokenId] = {};
            }
            positions[tokenId][positionId] = {
                x: x,
                y: y,
                rotation: rotation * Math.PI / 180
            };
        };

        var removeAllTokenPositions = function () {
            removeAllTokens();
            positions = {};
        };     

        var addTokenPositions = function (tokenId, posarray) {
            for (let i = 0; i < posarray.length; i++) {
                addTokenPosition(tokenId, i, posarray[i][0], posarray[i][1], posarray[i][2] || 0);
            }
        };

        var removeAllTokens = function (tokenId) {
            tokensOnTile[tokenId] = {};
        };

        var placeTokenAtPosition = function (tokenId, posId, variantId) {
            variantId = variantId || 0;
            if (!tokensOnTile[tokenId]) {
                tokensOnTile[tokenId] = {};
            }
            var variant = tokens[tokenId].getTokenVariant(variantId);
            var pos = positions[tokenId][posId] || dummy;
            tokensOnTile[tokenId][posId] = {
                image: variant.image,
                x: pos.x,
                y: pos.y,
                rotation: pos.rotation,
                sx: variant.sx,
                sy: variant.sy,
                swidth: variant.swidth,
                sheight: variant.sheight
            };
        };

        var addClickArea = function (id, path, info) {
            info = info || {};
            info['id'] = info['id'] || id;
            clickareas[id] = {
                path: path,
                info: info
            };
        };

        var getAllClickAreas = function () {
            return clickareas;
        };

        var addToken = function (id, image) {
            tokens[id] = token(image);
            return tokens[id];
        };

        var getProperties = function () {
            return properties;
        };

        var getAllTokens = function () {
            return tokensOnTile;
        };

        var that = {
            addToken: addToken,
            addTokenPosition: addTokenPosition,
            addTokenPositions: addTokenPositions,
            removeAllTokenPositions: removeAllTokenPositions,
            removeAllTokens: removeAllTokens,
            placeTokenAtPosition: placeTokenAtPosition,
            getProperties: getProperties,
            getAllTokens: getAllTokens,
            addClickArea: addClickArea,
            getAllClickAreas: getAllClickAreas
        };

        return that;
    };
    return factory;    
});