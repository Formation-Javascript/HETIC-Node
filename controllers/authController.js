const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');

// 1) Créer un JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// 2) Envoi du JWT au client et stockage dans un cookie
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // Le cookie ne peut pas être modifié par le navigateur
    httpOnly: true,
  };

  // Si on est en production, on doit sécuriser le cookie
  // secure : true signifie que le cookie ne sera envoyé que si la connexion est sécurisée (https)
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // On retire le mot de passe de la réponse
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async function (req, res) {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  // 1) Vérifier si l'email et le mot de passe ont été envoyés par l'utilisateur
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Vérifier si l'utilisateur existe et si le mot de passe est correct
  const user = await User.findOne({ email }).select('+password');

  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) Si tout est OK, envoyer le token au client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

exports.forgotPassword = catchAsync(async function (req, res, next) {
  // 1) Obtenir l'utilisateur basé sur l'email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  // 2) Générer le token aléatoire
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Envoyer le token au client par email
  // TODO : A faire dans le prochain chapitre si le temps le permet

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!',

    // TODO : A enlever
    data: {
      resetToken,
    },
  });
});

exports.resetPassword = catchAsync(async function (req, res, next) {
  // 1) Obtenir l'utilisateur basé sur le token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) Si le token n'a pas expiré et que l'utilisateur existe, définir le nouveau mot de passe
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // On supprime le passwordResetToken et le passwordResetExpires du document
  // Vu que le mot de passe a été modifié
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Envoyer le token au client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async function (req, res, next) {
  // 1) Vérifier si le token existe
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Vérifier si le token est valide
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) Vérifier si l'utilisateur existe toujours
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Vérifier si l'utilisateur a changé son mot de passe après l'émission du token
  // TODO : A faire dans le prochain chapitre

  // Accorder l'accès à la route protégée
  req.user = currentUser; // Permet d'accéder à l'utilisateur dans les prochaines middlewares
  res.locals.user = currentUser; // Permet d'accéder à l'utilisateur dans les vues (front-end)

  next();
});

// Middleware pour les rôles
exports.restrictTo = (...roles) => {
  // ...roles = le reste des arguments il permet de passer plusieurs arguments à la fonction

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      ); // 403 = Forbidden
    }

    next();
  };
};

/* // Middleware pour les utilisateurs connectés
exports.isLogged = catchAsync(async function (req, res, next) {
  
}); */