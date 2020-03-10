'use strict'

const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { check, validationResult } = require('express-validator');

// Import sequelize model
const SmarfGem = require('../models').SmarfGem;
const User = require('../models').User;

// Handler function to wrap each route.
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

// Authenication middleware
const authenticateUser = async (req, res, next) => {
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
};

const smarfChecker = [
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"'),
];

// GET /api/courses 200 - smarfGem listing route
router.get('/smarf-gems', asyncHandler( async(req, res) => {
  const smarfGems = await SmarfGem.findAll({
    attributes: ['id', 'userId', 'title', 'description', 'gem'],
    include: {
      model: User,
      as: 'author',
      attributes: ['id', 'username', 'emailAddress'],
    }
  });
  console.log(smarfGems);
  res.json({
    smarfGems
  });
}));

// GET /api/smarfGem/:id 200 - particular smarfGem AND user who created it route
router.get('/smarf-gems/:id', asyncHandler( async(req, res) => {
  const smarfGem = await SmarfGem.findByPk(
    req.params.id,
    { 
      attributes: ['id', 'userId', 'title', 'description', 'gem'],
      include: {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'emailAddress'],
      }
    }
    );
    res.json({
      smarfGem
    });
}));

// POST /api/smarfGem/:id 201 - create a smarfGem route
router.post('/smarf-gems', smarfChecker, authenticateUser, asyncHandler( async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsMessages = errors.array().map(error => error.msg);
    return res.status(400).json({message: errorsMessages});
  } else {
    const smarfGem = await SmarfGem.create(req.body);
    res.status(201).location(`/smarf-gems/${smarfGem.id}`).end();
  }

}));

// PUT /api/smarfGem/:id 204 - update a smarfGem route
router.put('/smarf-gems/:id', smarfChecker, authenticateUser, asyncHandler( async(req, res) => {
  let smarfGem = await SmarfGem.findByPk(req.params.id);
  if (smarfGem) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg);
      return res.status(400).json({message: errorsMessages});
    } else {
      if (req.currentUser.id === smarfGem.userId) {
        smarfGem.title = req.body.title;
        smarfGem.description = req.body.description;
        smarfGem.estimatedTime = req.body.estimatedTime;
        smarfGem.materialsNeeded = req.body.materialsNeeded;
      
        await smarfGem.save();
        res.status(204).end();
      } else {
        res.status(403).json({message: "You can only edit your own smarf-gems :("});
      } 
    }
  } else {
    res.status(404).json({message: "Couldn't find that smarf-gems :("});
  }

}));

// DELETE /api/smarfGem/:id 204 - delete a smarfGem route
router.delete('/smarf-gems/:id', authenticateUser, asyncHandler( async(req, res) => {
  let smarfGem = await SmarfGem.findByPk(req.params.id);

  if (smarfGem) {
    if (req.currentUser.id === smarfGem.userId) {
      await smarfGem.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({message: "You can only delete your own smarf-gems :("});
    }
  } else {
    res.status(404).json({message: "Couldn't find that smarf-gems :("});
  }
}));

module.exports = router;