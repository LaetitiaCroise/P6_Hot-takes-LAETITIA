// Importation du package express
const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
// Importation de path pour definir les chemins
const path = require('path');
// importation de dotEnv ( variable environementalle  pour Stocker en local mais cela reste inaccessesible au plublic)
const dotEnv = require('dotenv').config();

// Utilisation de la méthode 'mongoose.connect' pour se connecter a MongoDB.
mongoose.connect(process.env.secretKey,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();

//   Middleware :
//   qui n'a pas de route en premier argument car c'est un middleware général,
//   Ces headers permettent :
//   d'accéder a l'api depuis n'importe qu'elle origine ( '*' )
//   d'ajouter les headers autorisée aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) 
//   d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST, .. )

  app.use((req, res, next) => {
     // On rajoute des headers sur l'objet réponse:
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
// Middelware 
//   qui intercepte toutes les données qui contiennent du JSON
//   (content-type json) et nous mette à disposition ce contenu
//   sur l'objet requête dans req.body = "body parser"
//  
app.use(bodyParser.json());
app.use(express.json());
// Pour cette route '/api/sauces' on utilise le routeur saucesRoutes
app.use('/api/sauces', saucesRoutes);
// Pour cette route '/api/auth' on utilise le routeur usersRoutes
app.use ('/api/auth',userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// l'instruction export est utilisée dans les modules Javascript pour exporter  les fonctions, objets ou valeurs primitives
module.exports = app;