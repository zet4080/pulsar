define([], function () {
    let nextIndex = [0,0,0];
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let num = chars.length;
  
    return function () {
      var a = nextIndex[0];
      var b = nextIndex[1];
      var c = nextIndex[2];
      var id = chars[a] + chars[b] + chars[c];
  
      a = ++a % num;
  
      if (!a) {
        b = ++b % num; 
  
        if (!b) {
          c = ++c % num; 
        }
      }
      nextIndex = [a, b, c]; 
      return id;
    }    
});