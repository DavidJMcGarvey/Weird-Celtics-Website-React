'use strict'

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id : {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: '"Username" is required'
        },
        unique: {
          args: true,
          msg: 'Username already exists! Try another one :)'
        }
      }
    },
    emailAddress: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: '"Email" is required'
        },
        isEmail: {
          msg: 'Not a valid email address'
        }
      },
      unique: {
        args: true,
        msg: 'Email address already exists! Try another one :)'
      }
    },
    password: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: '"Password" is required'
        } 
      }
    }
  }, {sequelize});

  User.associate = (models) => {
    // Add (One to Many) association to SmarfGem model
    User.hasMany(models.SmarfGem, {
      as: 'author',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      },
    });
  };

  return User;
};