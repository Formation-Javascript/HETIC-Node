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
