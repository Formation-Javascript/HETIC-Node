const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.get('/', userController.getAllUsers);
router.route('/:id').get(userController.getUser);

router.use(authController.protect);

// Récupérer les informations de l'utilisateur connecté
router.route('/profile/me').get(authController.protect, userController.getMe);
// Créer un nouveau chemin pour mettre à jour les informations de l'utilisateur connecté
// -> '/profile/me' sera l'enpoint pour cela



// Toutes les routes suivantes nécessitent une authentification préalable
router.use(authController.restrictTo('admin', 'director', 'teacher'));

router
  .route('/:id')
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
