const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    // minLength: 6,
    minLength: [6, 'Title must be at least 6 characters long'],
    unique: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: [10, 'Description must be at least 10 characters long'],
  },
  // Completed status of the task it's done or not
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    // Permet de faire référence à un autre document dans la base de données
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user id'],
  },
});


TaskSchema.pre(/^find/, function(next){
  this.populate({
    path: 'createdBy',
    select: 'name -_id email'
  })
/*   .populate({
    path: 'category',
    select: "name"
  }) */

  next()
})

const Task = mongoose.model('Tasks', TaskSchema);

module.exports = Task;
