const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true, // loOIeR -> looier
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['director', 'teacher', 'student'],
    default: 'student',
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minLength: 8,
    select: false, // Ne sera pas envoyé dans les réponses
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // Fonctionne uniquement sur SAVE et CREATE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // Si le mot de passe n'est pas modifié, on ne fait rien
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12); // Scryptage du mot de passe

  this.passwordConfirm = undefined; // On supprime le passwordConfirm

  next();
});

userSchema.pre('save', function (next) {
  // Si le mot de passe n'est pas modifié ou si le document est nouveau, on ne fait rien
  if (!this.isModified('password') || this.isNew) return next();

  // On soustrait 1 seconde à la date de modification du mot de passe pour éviter les problèmes de synchronisation
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword, // Mot de passe envoyé par l'utilisateur
  userPassword // Mot de passe stocké dans la base de données
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // On crypte le token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //  console.log({ resetToken }, this.passwordResetToken);

  // On définit la date d'expiration du token
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
