'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/**
 * Users schema for mongoose.
 * {object} 
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @param {string} role
 * 
 */

const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {type: String, required:true, default:'user', enum:['admin','editor','user'] },
});
/**
 * Hashes all passwords before saving to the database
 * @function pre('save')
 * 
 */
users.pre('save', function(next) {
  bcrypt.hash(this.password,10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch( error => {throw error;} );
});
/**
 * Queries the Mongo DB with auth.username.  If found, will call comparePassword with auth.password
 * @function authenticateBasic
 * 
 */
users.statics.authenticateBasic = function(auth) {
  let query = {username: auth.username};
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(console.error);
};

/**
 * Uses bcrypt to compare the hashed password given with the hashed password in the database
 * @function comparePassword
 * @param {string} password - Hashed password passed in from the user
 */
users.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
  .then(valid => valid ? this: null);
};

/**
 * Builds a token from the users id, their capabilities, and a secret string
 * @function generateToken
 * @returns A signed jwt token
 */
users.methods.generateToken = function() {
  let tokenData = {
    id:this._id,
    capabilities: (this.acl && this.acl.capabilities) || [],
  };
  return jwt.sign(tokenData, process.env.SECRET || 'changeit' );
};

module.exports = mongoose.model('users', users);