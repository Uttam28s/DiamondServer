const joi = require("joi");
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
  },
  mob_no: {
    type: String,
    required: false,
    unique: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
  },
  profile_image: {
    type: String,
    required: false,
  },
  profile_min_image: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  device_token: {
    type: String,
    required: false,
  },
  role_ids: {
    type: Array,
    required: true,
  },
  facebook: {
    type: Object,
    required: false,
  },
  google: {
    type: Object,
    required: false,
  },
  preferences: {
    type: Object,
    required: false,
  },
  followers_count: {
    type: Number,
    required: true,
    default: 0,
  },
  following_count: {
    type: Number,
    required: true,
    default: 0,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
    select: false,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
    select: false,
  },
});

const createRequest = (body) => {
  const schema = joi.object().keys({
    name: joi
      .string()
      .required()
      .label("Name field"),
    user_name: joi
      .string()
      .required()
      .label("User name field"),
    gender: joi
      .string()
      .valid("MALE", "FEMALE", "OTHER")
      .allow("")
      .allow(null)
      .label("Gender field"),
  });
  return joi.validate(body, schema, { allowUnknown: true });
};

const loginRequest = (body) => {
  const schema = joi.object().keys({
    column: joi
      .string()
      .required()
      .label("Column field"),
    password: joi
      .string()
      .required()
      .label("Password field"),
  });
  return joi.validate(body, schema, { allowUnknown: true });
};

const socialLoginRequest = (body) => {
  const schema = joi.object().keys({
    type: joi
      .string()
      .required()
      .valid("facebook", "google")
      .label("Type field"),
    profile_id: joi
      .string()
      .required()
      .label("Profile ID field"),
    access_token: joi
      .string()
      .required()
      .label("Access token field"),
    name: joi
      .string()
      .required()
      .label("Name field"),
    user_name: joi
      .string()
      .required()
      .label("User name field"),
  });
  return joi.validate(body, schema, { allowUnknown: true });
};

const followingRequest = (body) => {
  const schema = joi.object().keys({
    action: joi
      .string()
      .required()
      .valid("follow", "unfollow")
      .label("action field"),
    following_id: joi
      .string()
      .required()
      .label("following_id field"),
  });
  return joi.validate(body, schema, { allowUnknown: true });
};

const blockingRequest = (body) => {
  const schema = joi.object().keys({
    action: joi
      .string()
      .required()
      .valid("block", "unblock")
      .label("action field"),
    blocking_id: joi
      .string()
      .required()
      .label("blocking_id field"),
  });
  return joi.validate(body, schema, { allowUnknown: true });
};

const preferencesRequest = (body) => {
  const schema = joi.object().keys({
    device_token: joi
      .string()
      .required()
      .label("device_token field"),
    os_type: joi
      .string()
      .required()
      .valid("android", "ios")
      .label("os_type field"),
    place: joi
      .string()
      .required()
      .label("device_token field"),
    notification_on: joi
      .boolean()
      .required()
      .label("notification_on field"),
    is_active: joi
      .boolean()
      .required()
      .label("is_active field"),
    geo_lat: joi.optional().label("geo_long field"),
    geo_long: joi
      .optional()
      .required()
      .label("geo_long field"),
  });
  return joi.validate(body, schema, { allowUnknown: true });
};

module.exports = {
  User: mongoose.model("User", schema),
  createRequest,
  loginRequest,
  socialLoginRequest,
  followingRequest,
  blockingRequest,
  preferencesRequest,
};
