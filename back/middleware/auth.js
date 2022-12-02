const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // fonction split pour récupéré aprrès l'espace tout le header , les erreurs s'aficherons dans le bloc catch
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // fonction veritfy pour décoder le token pour verifier sa validité
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
    //    si tout fonctione comme prévue on passe a la fonction next
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};

