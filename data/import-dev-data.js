const mongoose = require('mongoose');
const dotenv = require('dotenv');
const School = require('./../models/schoolsModel');
const fs = require('fs');
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB ✅'))
  .catch((e) => console.error('Error while connecting to MongoDB ❌', e));

// Importer les données dans la base de données

const importData = async function () {
  // ___dirname = chemin absolu du fichier actuel
  const schools = JSON.parse(
    fs.readFileSync(`${__dirname}/schools.json`, 'utf-8')
  );
  // fs.writeFileSync(`${__dirname}/copy.json`, schools);

  try {
    await School.create(schools);
    console.log('Data successfully loaded!');
  } catch (error) {
    console.log(error);
  }

  process.exit();
};

// Supprimer tous les documents de la collection
const deleteData = async function () {
  try {
    await School.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  // Permet de quitter le processus Node.js
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('Please use --import or --delete');
  process.exit();
}
