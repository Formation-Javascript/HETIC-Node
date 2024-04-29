const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async function (req, res) {
  const features = new APIFeatures(User.find(), req.query);

  const users = await features.query;

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async function (req, res, next) {
  const user = await User.findById(req.params.id);

  // Si l'utilisateur n'est pas trouvé
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async function (req, res, next) {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Retourne le nouvel utilisateur
    runValidators: true, // Exécute les validateurs du schéma
  });

  // Si l'utilisateur n'est pas trouvé
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async function (req, res, next) {
  const user = await User.findByIdAndDelete(req.params.id);

  // Si l'utilisateur n'est pas trouvé
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getMe = catchAsync(async function (req, res, next) {
  // req.user est défini dans le middleware protect de authController.js
  // Si l'utilisateur n'est pas trouvé
  if (!req.user) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});



exports.updateMe = catchAsync(async function (req, res, next) {
  // 1) Créer une erreur si l'utilisateur poste un mot de passe
  // 2) Mettre à jour les informations de l'utilisateur
  // 3) Retourner la réponse
});