const Sauce = require('../models/sauce');

module.exports = (req,res,next) => {
    let message = "";
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        if(req.body.like==1 && sauce.usersLiked.indexOf(req.body.userId)<0) {
            sauce.usersLiked.push(req.body.userId);
            sauce.likes+=1;
            message = "Vous aimez cette sauce ";
        } else if (req.body.like==-1 && sauce.usersDisliked.indexOf(req.body.userId)<0) {
            sauce.usersDisliked.push(req.body.userId);
            sauce.dislikes+=1;
            message = "Vous détestez cette sauce ";
        } else {
            sauce.usersLiked.forEach(element => {
                if(element==req.body.userId) {
                    sauce.likes-=1;
                    sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId),1);
                }
            });
            sauce.usersDisliked.forEach(element => {
                if(element==req.body.userId) {
                    sauce.dislikes-=1;
                    sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId),1);
                }
            });
            message = "Vous n'avez pas de préférence pour cette sauce ";
        }
        req.body.sauce = sauce;
        req.body.message = message
        next();
    })
    .catch(error => res.status(400).json({ error: "Une erreur est survenue !" }));
};