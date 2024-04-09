const School = require('../models/schoolsModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllSchools = catchAsync(async function (req, res, next) {
  const features = new APIFeatures(School.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Exécute la requête
  const schools = await features.query;

  // Si la page n'existe pas (aucun résultat)
  if (schools.length === 0) {
    return next(new AppError('No school found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: schools.length,
    data: { schools },
  });
});

exports.getOneSchool = catchAsync(async function (req, res, next) {
  const school = await School.findById(req.params.id);

  // Si l'école n'existe pas
  if (!school) {
    return next(new AppError('No school found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { school },
  });
});

exports.createSchool = catchAsync(async function (req, res) {
  const newSchool = await School.create(req.body);

  // res.status : Permet de définir le code de statut de la réponse HTTP
  // res.json : Envoie une réponse JSON

  res.status(201).json({
    status: 'success',
    message: 'School created successfully',
    data: { school: newSchool },
  });
});

exports.updateSchool = catchAsync(async function (req, res, next) {
  const school = await School.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Retourne le document modifié
    runValidators: true, // Exécute les validateurs du schéma
  });

  // Si l'école n'existe pas
  if (!school) {
    return next(new AppError('No school found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'School updated successfully',
    data: { school },
  });
});

exports.deleteSchool = catchAsync(async function (req, res, next) {
  const school = await School.findByIdAndDelete(req.params.id);

  // Si l'école n'existe pas
  if (!school) {
    return next(new AppError('No school found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'School deleted successfully',
    data: null,
  });
});
