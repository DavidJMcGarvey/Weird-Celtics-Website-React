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
    gem: {
      type: Sequelize.BLOB,
      validate: {
        notEmpty: {
          msg: '"Rad meme" is required'
        }
      }
    }
  }, {sequelize});

  SmarfGem.associate = (models) => {
    // Add (Many to One) association to User model
    SmarfGem.belongsTo(models.User, {
      as: 'author',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      },
    });
  };

  return SmarfGem;
};
