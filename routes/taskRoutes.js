const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  taskCompleted,
} = require('../controllers/taskController');

// ce chemin a pour préfixe /tasks car il est défini dans app.js

router.route('/').post(createTask).get(getAllTasks);
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);
router.patch('/:id/completed', taskCompleted);

module.exports = router;
