'use strict'

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class SmarfGem extends Sequelize.Model {}
  SmarfGem.init({
    id : {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: '"Title" is required'
        } 
      }
    },
    description: {
      type: Sequelize.TEXT,
      validate: {
        notEmpty: {
          msg: '"Description" is required'
        } 
      }
    },
    gem: {
      type: Sequelize.BLOB
    }
  }, {sequelize});

  return SmarfGem;
};