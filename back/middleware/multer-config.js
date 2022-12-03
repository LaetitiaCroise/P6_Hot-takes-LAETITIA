const multer = require('multer');

//  corespond au extension de fichier MINE TYPE destinée au envoie 
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// diskStorage fonction de multer pour enregstré sur le disque
const storage = multer.diskStorage({  
  // destination est la fonction qui prend 3 argument ( req , file, callback )
  // qui va retourner a multer dans quelle dossier enregistré les fichier.
  destination: (req, file, callback) => { 
    // Appelle du call back en lui donant un premier argument null et en 2eme argument  le dossier images
    callback(null, 'images');
  },
  // file name va expliquer à multer quelle type de fichier est utilisée 
  filename: (req, file, callback) => {
     // genenere le nouveau nom pour le fichier et supprime avec split les espace par des undercors
    const name = file.originalname.split(' ').join('_');
    // genere une extention au fichier avec MineType
    const extension = MIME_TYPES[file.mimetype];
    // Appelle du callback Ajout un premier argument null(pas erreur) création du file name + création du timestamp pour le rendre unique 
    //et les extention du fichier
    callback(null, name + Date.now() + '.' + extension);
  }
});
//  exporte le module middleware multer avec l'objet storage et le fichier image uniquement 
module.exports = multer({storage: storage}).single('image');