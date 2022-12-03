// On importe le package mongoose.
const mongoose = require("mongoose");
// On rajoute ce validateur comme plugin à notre schéma.
const uniqueValidator = require("mongoose-unique-validator");

//   Utilisation de la fonction .Schema du package mongoose pour
//   créer un schéma de données qui seront les données utilisateurs
//   pour pouvoir ce connecter.

const userSchema = mongoose.Schema({
  //   On passe la configuration 'required' pour dire que ce champ est requis.
  //   On passe la configuration 'unique' pour ne pas que l'adresse mail soit utilisée a nouveau
  //  plusieurs fois pour plusieurs compte différents.

  // adresse e-mail de l'utilisateur [unique]
  email: { type: String, required: true, unique: true },
  // mot de passe de l'utilisateur haché
  password: { type: String, required: true },
});
// On applique ce validator à notre schéma avant d'en faire un model
userSchema.plugin(uniqueValidator);

//   Pour exploiter ce schéma comme model pour cela, on vas utiliser
//   la méthode du package mongoose 'models':
//    le nom du model,
//    le schéma à utiliser
module.exports = mongoose.model("User", userSchema);
