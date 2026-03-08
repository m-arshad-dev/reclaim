// const { v4: uuid } = require("uuid");

// function generateToken() {
//   return uuid();
// }
const crypto = require("crypto");

function generateToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}


module.exports = {
    generateToken
};