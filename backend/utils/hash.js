const bcrypt = require("bcrypt");

async function hashPassword(password) {
  console.log("hashPassword input:", password);
  if (!password) throw new Error("password Required");
  const hash = await bcrypt.hash(password, 10);
  console.log("hashPassword output:", hash);
  return hash;
}

async function comparePassword(password, hash) {
  if (!password || !hash){
    console.log("fuck")
  } 
  return  bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword
};