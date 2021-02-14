import jwtDecode from 'jwt-decode'
let cookieparser = require('cookieparser')

export function getUserFromCookie(req) {
    if (process.server && process.static) return
    if (!req.headers.cookie) return

    if (req.headers.cookie) {
        const parsed = cookieparser.parse(req.headers.cookie)
        const accessTokenCookie = parsed.ncacls_token
        if (!accessTokenCookie) return

        const decodedToken = jwtDecode(accessTokenCookie)
        if (!decodedToken) return

        return decodedToken
    }
}

export function createUserID(length) {
    // Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let result           = '';
    const characters       = '0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }