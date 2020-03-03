'use strict'

const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { check, validationResult } = require('express-validator');

// Import sequelize model
const User = require('../models').User;

// Handler function to wrap each route.
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      console.log(error);
      res.status(500).send(error);
    }
  }
}

// Authenication middleware
const authenticateUser = asyncHandler( async (req, res, next) => {
  let message = null;
  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name,
      },
    });

    if (user) {
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);

      if (authenticated) {
        console.log(`Authentication successful for username: ${user.username}`);
        req.currentUser = user;

      } else {
        message = `Authentication failure for username: ${user.username}`;
      } 
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = `Auth header not found`;
  }
  
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
});

const userChecker = [
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "firstName"'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "lastName"'),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true})
    .withMessage('Please provide a value for "emailAddress"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "password"'),
];

// GET Welcome JSON message as a home route
router.get('/', asyncHandler((req, res) => {
  res.json({
    Greetings: "Welcome to Davey's REST API!",
    Did: "you know this would pair well with a nice front-end?"
  });
})); 

// GET /api/users 200 - return current user route
router.get('/users', authenticateUser, (req, res) => {
  const user = req.currentUser;
  res.json({
    id: user.id,
    username: user.username,
    emailAddress: user.emailAddress
  });
});

// POST /api/users 201 - create a user route
router.post('/users', userChecker, async(req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ errors: errorMessages });
    } else {
      const user = await req.body;
      user.password = bcryptjs.hashSync(user.password);
  
      await User.create(req.body);
      res.status(201).location('/').end();
    }
  } catch (error) {
    console.log(error);
    const whoopsies = error.errors.map(error => error.message);
    res.status(409).json({ whoopsies });
  }


});

// PUT /api/courses/:id 204 - update a course route
router.put('/users/:id', authenticateUser, asyncHandler( async(req, res) => {
  let user = await User.findByPk(req.params.id);

  if (user) {
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.emailAddress = req.body.emailAddress;
    user.password = req.body.password;
    
    await user.save();
    res.status(204).end();
  } else {
    res.status(404).json({message: "Couldn't find that user :("});
  }

}));

//TEMP DELETE ROUTE
router.delete('/users/:id', authenticateUser, asyncHandler( async(req, res) => {
  let user = await User.findByPk(req.params.id);

  if (user) {
    await user.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({message: "Couldn't find that user :("});
  }
}));

module.exports = router;