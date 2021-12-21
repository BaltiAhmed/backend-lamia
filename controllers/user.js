const httpError = require("../models/error");

const user = require("../models/user");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, email, password } = req.body;
  let existinguser;
  try {
    existinguser = await user.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existinguser) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  const createduser = new user({
    name,
    email,
    password,
    prixT: 0,
    bloque: false,
    commandes: [],
    favories: [],
  });

  try {
    await createduser.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createduser.id, email: createduser.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createduser.id, email: createduser.email, token: token });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed", 422));
  }
  const { email, password } = req.body;
  let existinguser;
  try {
    existinguser = await user.findOne({ email: email });
  } catch {
    return next(new httpError("failed!!", 500));
  }
  if (!existinguser || existinguser.password !== password) {
    return next(new httpError("invalid input password", 422));
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existinguser.id, email: existinguser.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.status(200).json({ user: existinguser, token: token });
};

const getUser = async (req, res, next) => {
  let existinguser;
  try {
    existinguser = await user.find({}, "-pasword");
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existinguser: existinguser });
};

const getUserById = async (req, res, next) => {
  const id = req.params.id;
  let existinguser;
  try {
    existinguser = await user.findById(id);
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existinguser: existinguser });
};

const deleteuser = async (req, res, next) => {
  const id = req.params.id;
  let existinguser;

  try {
    existinguser = await user.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }
  if (!existinguser) {
    return next(new httpError("user does not exist", 500));
  }

  try {
    await existinguser.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};
const updateUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, email, password } = req.body;
  const UserId = req.params.UserId;
  let existinguser;

  try {
    existinguser = await user.findById(UserId);
  } catch {
    return next(new httpError("failed ", 500));
  }
  existinguser.name = name;
  existinguser.email = email;
  existinguser.password = password;

  console.log(existinguser);
  try {
    existinguser.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ existinguser: existinguser });
};

const blockUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const UserId = req.params.id;
  let existinguser;

  try {
    existinguser = await user.findById(UserId);
  } catch {
    return next(new httpError("failed ", 500));
  }
  existinguser.bloque = true;

  console.log(existinguser);
  try {
    existinguser.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ existinguser: existinguser });
};

const unblockUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const UserId = req.params.id;
  let existinguser;

  try {
    existinguser = await user.findById(UserId);
  } catch {
    return next(new httpError("failed ", 500));
  }
  existinguser.bloque = false;

  console.log(existinguser);
  try {
    existinguser.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ existinguser: existinguser });
};

exports.signup = signup;
exports.login = login;
exports.getUser = getUser;
exports.getUserById = getUserById;
exports.deleteuser = deleteuser;
exports.updateUser = updateUser;
exports.blockUser = blockUser;
exports.unblockUser = unblockUser;
