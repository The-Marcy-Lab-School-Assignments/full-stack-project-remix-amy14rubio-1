require('dotenv').config();
const userModel = require('../models/userModel');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({ error: 'Username and password are required.' });
    }

    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).send({ error: 'Username already taken.' });
    }

    const user = await userModel.create(username, password);
    req.session.user_id = user.user_id;
    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.validatePassword(username, password);
    if (!user) return res.status(401).send({ error: 'Invalid credentials.' });
    req.session.user_id = user.user_id;
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.googleLogin = async (req, res, next) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture, sub } = ticket.getPayload();

    let user = await userModel.findByGoogleId(sub);
    if (!user) {
      user = await userModel.createGoogleUser(name, sub);
    }

    req.session.user_id = user.user_id;

    res.status(200).json(user);
  } catch (error) {
    console.log('google login error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Returns the logged-in user object, or null if no session exists.
// Returning JSON null (200) keeps the response format consistent — the frontend
// can always call response.json() without hitting a parse error.
module.exports.getMe = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.json(null);
    const user = await userModel.find(req.session.user_id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports.logout = (req, res) => {
  req.session = null;
  res.send({ message: 'Logged out.' });
};
