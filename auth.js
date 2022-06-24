const jwtSecret= 'your_jwt_secret';
const jwt = require('jsonwebtoken'),
  passport =require('passport');

require('./passport');

/**
 * creates JWT token that expires in 7 days (token is encoded with HS256)
 * @param {object} user 
 * @returns user object, jwt, and additional information on token
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: '7d',
    algorithm: 'HS256'
  });
};


/**
 * POST: Logs a user in, generating a jwt token
 * @function generateJWTToken
 * @param {*} router 
 * @returns {object} user object with jwt token
 * @requires passport
 */
module.exports = (router) => {
  router.post('/login', (req, res)=> {
    passport.authenticate('local', {session: false}, (error, user, info) =>{
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, {session:false}, (error) =>{
        if(error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({user, token});
      });
    })(req, res);
  });
};
