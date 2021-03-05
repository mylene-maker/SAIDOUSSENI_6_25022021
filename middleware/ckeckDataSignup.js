module.exports = (req,res,next) => {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

    if(regexEmail.test(req.body.email)) {
        if(regexPassword.test(req.body.password)) {
            next();
        } else {
            res.status(400).json({ message: "Le mot de passe doit comporter au moins 10 caractères, "
            +"posséder au moins un chiffre, une lettre majuscule et minuscule et l'un des caractères spéciaux suivants: @$!%*?&."});
        }
    } else {
        res.status(400).json({ message: "Le login doit être une adresse email valide !"});
    }
}