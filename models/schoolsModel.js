const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A school must have a name'],
    unique: true,

    // Permet de supprimer les espaces en début et fin de chaîne de caractères
    trim: true,
    maxLength: [40, 'A school name must have less or equal then 40 characters'],
  },
  address: {
    street: {
      type: String,
      required: [true, 'A school must have a street'],
      // Permet de supprimer les espaces en début et fin de chaîne de caractères
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'A school must have a city'],
      // Permet de supprimer les espaces en début et fin de chaîne de caractères
      trim: true,
    },
    zipCode: {
      type: Number,
      required: [true, 'A school must have a zip code'],
      // Permet de supprimer les espaces en début et fin de chaîne de caractères
      trim: true,
      maxLength: [
        5,
        'A school zip code must have less or equal then 5 characters',
      ],
    },
    country: {
      type: String,
      required: [true, 'A school must have a country'],
      // Permet de supprimer les espaces en début et fin de chaîne de caractères
      trim: true,
    },
  },
  type: {
    type: String,
    required: [true, 'A school must have a type'],
    // Permet de supprimer les espaces en début et fin de chaîne de caractères
    trim: true,

    // Enum permet de définir une liste de valeurs possibles pour un champ donné
    enum: {
      values: ['public', 'private'],
      message: 'A school must be either public or private',
    },

    // Correspond au type de l'école (primaire, secondaire, lycée, supérieur, etc.)
    level: {
      type: String,
      required: [true, 'A school must have a level'],
      // Permet de supprimer les espaces en début et fin de chaîne de caractères
      trim: true,
      // Enum permet de définir une liste de valeurs possibles pour un champ donné
      enum: {
        values: ['primary', 'secondary', 'high'],
        message: 'A school must be either primary, secondary or high',
      },

      averageNote: {
        type: Number,
        // Permet de définir une valeur par défaut
        default: 0,
        // Permet de définir une valeur minimale
        min: [0, 'Average note must be above 0'],
        // Permet de définir une valeur maximale
        max: [5, 'Average note must be below 5'],
      },
    },
  },
});

// Création du modèle School à partir du schéma schoolSchema
const School = mongoose.model('School', schoolSchema);

module.exports = School;
