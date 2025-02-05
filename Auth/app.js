const express = require("express");
// Importantion de la connexion à MongoDB
require("./app/models/index.js");

require('./app/utils/cron.js'); // Lancer les tâches cron

const router = require("./app/routes/index.js");

const app = express();
app.use(express.json());

//Ajout des routes
app.use("/", router);

module.exports = app;