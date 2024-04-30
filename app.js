var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const tasksRouter = require('./routes/taskRoutes');
const userRouter = require('./routes/userRoutes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/tasks', tasksRouter);
/* 
Les methodes HTTP
GET: pour lire des données
POST: pour créer des données
PUT & PATCH: pour mettre à jour des données
DELETE: pour supprimer des données
*/

app.use('/tasks', tasksRouter);
app.use('/users', userRouter);

// app.route('/tasks').post(createTask).get(getTasks);
/* -------------------------------------------------------------------------- */
/*                           crée une nouvelle tâche                          */
/* -------------------------------------------------------------------------- */
/* app.post('/tasks', async function (req, res) {
  try {
    // Créer une nouvelle tâche
    console.log(req.body);
    const newTask = await Task.create(req.body);

    // Renvoyer la tâche créée
    res.status(201).json({
      status: 'success',
      data: {
        task: newTask,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}); */

/* -------------------------------------------------------------------------- */
/*                         Recuperer toutes les tâches                        */
/* -------------------------------------------------------------------------- */
/* app.get('/tasks', async function (req, res) {
  try {
    const tasks = await Task.find();

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}); */

//app.route('/tasks/:id').get(getTask).patch(updateTask).delete(deleteTask);
/* -------------------------------------------------------------------------- */
/*                       Récuperer une tache par son id                       */
/* -------------------------------------------------------------------------- */
/* 
    - On utilise le paramètre de route :id pour récupérer l'id de la tâche
    - On utilise la méthode de `Mongoose` findById() pour récupérer la tâche par son id
    - On renvoie la tâche trouvée
*/

/* app.get('/tasks/:id', async function (req, res) {
  try {
    const task = await Task.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        task,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
});
 */
/* -------------------------------------------------------------------------- */
/*                           Mettre a jour une tache                          */
/* -------------------------------------------------------------------------- */
/*
PATCH : modifier une tâcche partielle (quelques champs)
PUT : modifier une tâche entière (tous les champs)
*/

/* app.patch('/tasks/:id', async function (req, res) {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        task,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}); */

/* -------------------------------------------------------------------------- */
/*                             Supprimer une tâche                            */
/* -------------------------------------------------------------------------- */
/* app.delete('tasks/:id', async function (req, res) {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}); */

// tasks/completed

/* app.patch('/tasks/:id/completed', async function (req, res) {
  try {
    const id = req.params.id;

    const task = await Task.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true } // pour renvoyer la tâche mise à jour et non l'ancienne
    );

    res.status(200).json({
      status: 'success',
      data: {
        task,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}); */

app.all('*', (req, res) =>
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  })
);

module.exports = app;
