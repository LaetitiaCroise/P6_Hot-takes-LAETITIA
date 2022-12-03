// Runtime Node, c'est ce qui permet d'éxecuter du code javascript
// require = C'est la commande pour importer le package http de node.
const http = require('http');
// require = je viens importer le fichier app.js
const app = require('./app');

// La fonction parseInt() analyse une chaîne de caractère fournie en argument et renvoie un entier exprimé dans une base donnée.
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// fonction renvoyant un port valide qu'il soit fourni sous la forme d'un numéro ou d'une chaîne.

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// La fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée, elle est ensuite enregistrer dans le serveur.
const errorHandler = error => {
  if (error.syscall !== 'listen') {

    // L'instruction throw permet de lever (throw en anglais) une exception. 
    //       Lorsqu'on lève une exception, expression fournit la valeur de l'exception
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// La méthode http.createServer() crée un objet HTTP Server. Ont lui passe en paramètre "app"
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});
//La méthode server.listen() crée une écoute sur le port ou le chemin spécifié.
// En paramètre, le num du port que l'on veut écouter -> par défaut 3000
// Si le port 3000 n'est pas dispo -> utilisation d'une variable environement = process.env.PORT
// 
server.listen(port);
