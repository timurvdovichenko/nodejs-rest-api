const express = require('express');
const { loginSchema, registerSchema } = require('../../schemas/userSchema');
const { validateBody, authenticate } = require('../../middlewares');
const {
  registerController,
  loginController,
  getCurrentController,
  logoutController,
} = require('../../controllers/authController');

const router = express.Router();

// signup
router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);
router.get('/current', authenticate, getCurrentController);
router.post('/logout', authenticate, logoutController);
module.exports = router;
