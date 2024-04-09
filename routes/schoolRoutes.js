const express = require('express');
const router = express.Router();

const schoolControllers = require('../controllers/schoolControllers');

// VERSION SIMPLE

/*  router.get('/', schoolControllers.getAllSchools);
// Get One School
router.get('/:id', schoolControllers.getOneSchool);

router.post('/', schoolControllers.createSchool);

router.patch('/:id', schoolControllers.updateSchool);

router.delete('/:id', schoolControllers.deleteSchool);
*/


// VERSION COMPRESSEE
router
  .route('/')
  .get(schoolControllers.getAllSchools)
  .post(schoolControllers.createSchool);

/*
  Pour mettre à jour une école, on utilise la méthode HTTP PATCH ou PUT.
  PATCH : Permet de mettre à jour partiellement une ressource
  PUT : Permet de mettre à jour entièrement une ressource

  Quand on utilise PUT, on doit envoyer toutes les données de la ressource
  Quand on utilise PATCH, on peut envoyer seulement les données que l'on souhaite mettre à jour
  */
router
  .route('/:id')
  .get(schoolControllers.getOneSchool)
  .patch(schoolControllers.updateSchool)
  .delete(schoolControllers.deleteSchool);



module.exports = router;
