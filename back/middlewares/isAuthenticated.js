const jwt = require('jsonwebtoken')

const isAuthenticated = (req, res, next) => {
    try {
      if (req.headers.authorization?.split('')[0] === 'Bearer'){
        // we get the second part of the header, which contains the JWT, and save it into the token variable. 
        const token = req.headers.authorization?.split(' ')[1] // get the token from headers "Bearer 123XYZ..."
        const payload = jwt.verify(token, process.env.TOKEN_SECRET) // jwt.verify() decode token and extract the payload
      
        req.tokenPayload = payload // to pass the decoded payload to the next route
        next()
      } else {
        throw new Error('No token')
      }

    } catch (error) {
      // the middleware will catch error and send 401 if:
      // 1. There is no token
      // 2. Token is invalid
      // 3. There is no headers or authorization in req (no token)
      console.error(error.message)
      res.status(401).json('Token not provided or not valid')
    }
  }

 module.exports = {
    isAuthenticated
 }

 /* Alternative - with express-jwt
 const { expressjwt } = require('express-jwt')

function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(' ')[1]
    return token
  }

  return null
}

const isAuthenticated = expressjwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'payload',
  getToken: getTokenFromHeaders,
})

module.exports = isAuthenticated
*/