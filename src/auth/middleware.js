'use strict';

const User = require('./users-model.js');

module.exports = (req, res, next) => {

  try {
    /**
     * @param {string} authType
     * @param {string} encodedString
     * 
     */
    let [authType, encodedString] = req.headers.authorization.split(' ');

    // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=

    switch(authType.toLowerCase()) {
      case 'basic':
        return _authBasic(encodedString);
      default:
        return _authError();
    }

  } catch(e) {
    return _authError();
  }
/**
 * Creates an auth object with username and password.
 * Passes to User.authenticateBasic, then to _authenticate
 * 
 * @param {string} encodedString base64 string from Authorization header
 * @function _authBasic
 */
  function _authBasic(encodedString) {
    let base64Buffer = Buffer.from(encodedString,'base64'); // <Buffer 01 02...>
    let bufferString = base64Buffer.toString(); // john:mysecret
    let [username,password] = bufferString.split(':');  // variables username="john" and password="mysecret"
    let auth = {username,password};  // {username:"john", password:"mysecret"}

    return User.authenticateBasic(auth)
      .then( user => _authenticate(user) );
  }
  /**
   * Attaches the user and a token to the request object
   * @function _authenticate
   * @param {*} user 
   */
  function _authenticate(user) {
    if ( user ) {
      req.user = user;
      req.token = user.generateToken();
      return next();
    }
    else {
      return _authError();
    }
  }

  /**
   * Calls next with an error message object
   * @function _authError
   */
  function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
  }

};