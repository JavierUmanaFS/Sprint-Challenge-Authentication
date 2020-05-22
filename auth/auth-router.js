const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = require('express').Router();

const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-services.js");

router.post('/register', (req, res) => {
  const credentials = req.body;

  if(isValid(credentials)){
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;

    Users.add(credentials)
    .then(user => {
      res.status(201).json({ data: user });
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error.message})
    });
  } else {
    res.status(400).json({ message: "Please provide username and password. Password should be alphanumeric"})
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if(isValid(req.body)){
    Users.findBy({ username })
    .then(([user]) => {
      if(user && bcryptjs.compareSync(password, user.password)){
        const token = createToken(user);
        res.status(200).json({ message:"Welcome to our api", token})
      } else {
        res.status(401).json({ message: "Invalid credentials "})
      }
    })
    .catch(error =>{
      res.status(500).json({ errorMessage: error.message})
    })
  } else {
    res.status(400).json({ message:" Please provide valid credentials"})
  }
});

function createToken(user){
  const payload = {
    sub: user.id,
    username: user.username,
  };

  const secret = "keepitsecret,keepitsafe!";

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}
module.exports = router;
