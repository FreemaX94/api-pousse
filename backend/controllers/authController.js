const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const createError = require('../utils/createError');

const generateToken = (user, expiresIn = '1h') => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) throw createError(404, 'Utilisateur non trouvé');

    if (!user.isActive) {
      return res.status(403).json({ message: "Compte non activé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError(401, 'Mot de passe incorrect');

    const accessToken = generateToken(user, '1h');
    const refreshToken = generateToken(user, '7d');

    user.refreshToken = refreshToken;
    user.lastUserAgent = req.headers['user-agent'];
    user.lastIP = req.ip;
    await user.save();

    res.cookie('sid', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 3600000,
    });

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, password, email, role } = req.body;

    const user = new User({
      username,
      email,
      password,
      role: role || 'user',
      isActive: true
    });

    await user.save();
    res.status(201).json({ success: true, message: 'Utilisateur créé' });
  } catch (err) {
    next(err);
  }
};

const activate = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) throw createError(404, 'Utilisateur non trouvé');
    user.isActive = true;
    await user.save();
    res.status(200).json({ success: true, message: 'Utilisateur activé' });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Token manquant' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    const newAccessToken = generateToken(user, '1h');
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

const me = (req, res) => {
  res.status(200).json({ user: req.user });
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies.sid;
    if (!token) return res.status(200).json({ success: true });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    // 🔒 TODO : Ajouter token dans blacklist Redis ici

    res.clearCookie('sid');
    res.status(200).json({ success: true, message: 'Déconnecté avec succès' });
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = {
  register,
  login,
  activate,
  refresh,
  me,
  logout
};

