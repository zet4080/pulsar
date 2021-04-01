define([], function () {

    variants = {};

    const addTokenVariant = function (tokenId, variantId, token) {
        if (!variants[tokenId]) {
            variants[tokenId] = {};
        }
        variants[tokenId][variantId] = token;
    };

    const addToken = function (tokenId, token) {
        variants[tokenId] = token;
    };


    const getTokenVariant = function (tokenId, variantId) {
        return variants[tokenId][variantId];
    };

    const getToken = function (tokenId) {
        return variants[tokenId];
    }

    const tokentray = function (arg1, arg2, arg3) {
        if (arg3) {
            addTokenVariant(arg1, arg2, arg3);
            return null;
        } else if (arg2 && arg2.draw) {
            return addToken(arg1, arg2);
        } else if (arg2) {
            return getTokenVariant(arg1, arg2)
        } else {
            return getToken(arg1);
        }
    }
    
    return tokentray;

});