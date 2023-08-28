const express = require('express');
const {
  loginSchema,
  registerSchema,
  updateSubscriptionJoiValidation,
} = require('../../schemas/userSchema');
const { validateBody, authenticate, upload } = require('../../middlewares');
const {
  registerController,
  loginController,
  getCurrentController,
  logoutController,
  subscriptionController,
  updateAvatarController,
} = require('../../controllers/authController');

const router = express.Router();

// signup
router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);
router.get('/current', authenticate, getCurrentController);
router.post('/logout', authenticate, logoutController);
router.patch(
  '/',
  authenticate,
  validateBody(updateSubscriptionJoiValidation),
  subscriptionController,
);
router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatarController);

module.exports = router;
