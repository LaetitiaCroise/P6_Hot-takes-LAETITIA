// Controllers contient la logique métier qui est appliquer à chaques routes.

// On importe le model sauce
const Sauce = require('../models/sauce');
const User = require('../models/User');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        likes: 0,
        dislikes: 0,
        usersDisliked: [],
        usersLiked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};
exports.getOneSauce = (req, res) => {
  // on utilise le modele mangoose et findOne pour trouver un objet via la comparaison req.params.id
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
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
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
    
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
          const likeType = req.body.like;
          const userId = req.auth.userId;
          switch (likeType) {
              // Like
              case 1: 
                  if (!sauce.usersLiked.includes(userId)) {
                      sauce.usersLiked.push(userId);
                      ++sauce.likes;
                  }
                  
                  break;
              // Annulation
              case 0:
                  if (sauce.usersDisliked.includes(userId)) {
                      sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                      --sauce.dislikes;
                  } else if (sauce.usersLiked.includes(userId)) {
                      sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                      --sauce.likes;
                  }
                  break;
              // Dislike
              case -1:
                  if (!sauce.usersDisliked.includes(userId)) {
                      sauce.usersDisliked.push(userId);
                      ++sauce.dislikes;
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