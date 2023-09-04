const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const { HttpError, controllerWrapper, sendMail } = require('../helpers');
const { User } = require('../schemas/userSchema');
const { SECRET_KEY, BASE_URL } = process.env;
const path = require('path');
const avatarsDir = path.join(__dirname, '..', 'public', 'avatars');
const fs = require('fs/promises');
const jimp = require('jimp');

const { nanoid } = require('nanoid');

const registerController = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: [email],
    subject: 'Verify Email',
    text: 'Verify text',
    html: `<h1>Verify Email Html</h1><a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify your email</a>`,
  };

  sendMail(verifyEmail);
  res.status(201).json({ email: newUser.email, subscription: newUser.subscription });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  // console.log('email :>> ', email);
  // console.log('password :>> ', password);
  const user = await User.findOne({ email });

  // console.log('user :>> ', user);

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }
  if (!user.verify) {
    throw HttpError(401, 'Email not verified');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const payload = { id: user._id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({ token, user: { email, subscription: user.subscription } });
};

const getCurrentController = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logoutController = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.status(204).json({ message: '' });
};

const subscriptionController = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const result = await User.findByIdAndUpdate(_id, { subscription: subscription }, { new: true });
  if (!result) {
    throw HttpError(404, 'Not Found');
  }

  res.status(200).json(result);
};

const updateAvatarController = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const image = await jimp.read(resultUpload);
  await image.resize(250, 250).write(resultUpload);
  const avatarURL = path.join('avatars', filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};

const verifyEmailController = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: '' });
  res.status(200).json({ message: 'Verification successful' });
};

const resendVerifyEmailController = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email not found');
  }
  if (user.verify) {
    throw HttpError(401, 'Verification has already been passed');
  }

  const verifyEmail = {
    to: [email],
    subject: 'Verify Email',
    text: 'Verify text',
    html: `<h1>Verify Email Html</h1><a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify your email</a>`,
  };
  sendMail(verifyEmail);
  res.status(200).json({ message: 'Verification email sent' });
};

module.exports = {
  registerController: controllerWrapper(registerController),
  loginController: controllerWrapper(loginController),
  getCurrentController: controllerWrapper(getCurrentController),
  logoutController: controllerWrapper(logoutController),
  subscriptionController: controllerWrapper(subscriptionController),
  updateAvatarController: controllerWrapper(updateAvatarController),
  verifyEmailController: controllerWrapper(verifyEmailController),
  resendVerifyEmailController: controllerWrapper(resendVerifyEmailController),
};
