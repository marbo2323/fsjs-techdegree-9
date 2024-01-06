"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {}
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "A firstName is required" },
          notEmpty: { msg: "Please provide a firstName" },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "A lastName is required" },
          notEmpty: { msg: "Please provide a lastName" },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "The emailAddress You entered already exists" },
        validate: {
          notNull: { msg: "An emailAddress is required" },
          notEmpty: { msg: "Please provide an emailAddress" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "A password is required" },
          notEmpty: { msg: "Please provide a password" },
        },
      },
    },
    { sequelize }
  );
  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: "user",
      foreignKey: { fieldName: "userId" },
    });
  };
  return User;
};
