// Controllers contient la logique métier qui est appliquer à chaques routes.

// On importe le model sauce, model user, le module fs ( File Systeme)
const Sauce = require('../models/sauce');
const User = require('../models/User');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId; // On supprime en amont le faux 'userId' envoyer par le frontend.
    const sauce = new Sauce({
        ...sauceObject, // L'opérateur spread '...' permet de faire des copies de tous les éléments de req.body
        // userId: req.auth.userId,
        // likes: 0,
        // dislikes: 0,
        // usersDisliked: [],
        // usersLiked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

//Méthode .save() qui permet d'enregistrer l'objet dans la base de données.
//Ici on viens créer une instance de notre modèle 'sauce' 
//en lui passant un objet javascript contenant toutes les informations requises du corps de requête analysé. 

    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};
exports.getOneSauce = (req, res) => {
  // on utilise le modele mangoose et la methode findOne pour trouver un objet via la comparaison req.params.id
  Sauce.findOne({ _id: req.params.id })
  // status 200 OK et l'élément en json
  .then((sauce) => res.status(200).json(sauce))
  // si erreur envoit un status 404 Not Found et l'erreur en json
  .catch((error) => res.status(404).json({ error }));
  };

exports.modifySauce = (req, res, next) => {
  // extrait le champs file
    const sauceObject = req.file ? { 
      //recupere l'objet en paarcant la chaine de caractere
        ...JSON.parse(req.body.sauce),
        //recrée l'url de l'img
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        // si c'est pas le cas récupère l'objet dans le corps de la requete
    } : { ...req.body }; 
  
    delete sauceObject._userId;
    
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } 
        //Méthode updateOne() pour mettre à jour, modifier une sauce dans la base de donnée.
        //l'objet de comparaison en premier lieu, pour savoir lequel on modifie (_id: req.params.id)
        // en 2eme lieu le nouvel objet
            else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Non autorisé'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1]; // pour suprimée une image on utilise .spliit [1]
            fs.unlink(`images/${filename}`, () => { // file systhem  unlink pour suprimer les images 
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.likeDislike = (req, res, next) => {
// récupération d'une sauces avec findOne() et son Id
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
          const likeType = req.body.like;
    // Si like = 1, l'utilisateur aime (= likes)
          const userId = req.auth.userId; 
          switch (likeType) {

              // Like commence ici 
              case 1: 
                  if (!sauce.usersLiked.includes(userId)) {
                    //// L’opérateur push permet de rajouter un nouvel élément à un tableau.
                      sauce.usersLiked.push(userId);
                      //++ permet de rajouter une valeur à une donnée numérique. 
                      ++sauce.likes;
                  }
                  
                  break;
              // Annulation si la personne s'est tromper le like dislike commence ici 
            //  Si like = 0, l'utilisateur annule son like ou son dislike
              case 0:
                  if (sauce.usersDisliked.includes(userId)) {
                      sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                      --sauce.dislikes;// annulation du disklike
                  } else if (sauce.usersLiked.includes(userId)) {
                      sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);// supression du userliked en fonction de son id
                      --sauce.likes; // annulation du like
                  }
                  break;
              // Dislike commence ici 
              //// Si like = -1, l'utilisateur n'aime pas (= dislikes)
              case -1:
                  if (!sauce.usersDisliked.includes(userId)) {
                      sauce.usersDisliked.push(userId);// ajout du userId + dislike dans le tableau
                      ++sauce.dislikes; // ajout dislikes
                  }
                  break;
              default:
                  res.status(401).json({ message: "La valeur de like est fausse" })
                  break;
          }
          sauce.save()
          .then(() => { res.status(200).json({message: 'Avis enregistré !'})})
          .catch(error => { res.status(400).json( { error })})
      })
  .catch(error => res.status(404).json({ error }));
};