/* eslint-disable prefer-regex-literals */
const { Schema, model } = require("mongoose");
const Joi = require("joi");

// eslint-disable-next-line no-useless-escape
const emailRegexp = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match: emailRegexp,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
});

const joiSignupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const joiLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const User = model("user", userSchema);
module.exports = { User, joiSignupSchema, joiLoginSchema };
