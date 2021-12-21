const httpError = require('../models/error');

const Rlivraison = require('../models/responsable-livraison');

const { validationResult } = require('express-validator');

const jwt = require('jsonwebtoken')

const generator = require('generate-password');

const nodemailer = require('nodemailer');
const responsableProduit = require('../models/responsable-produit');
const log = console.log;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL || 'hezzilamia8@gmail.com', // TODO: your gmail account
        pass: process.env.PASSWORD || 'aline23141679' // TODO: your gmail password
    }
});

const signup = async (req, res, next) => {
    /* const error = validationResult(req);
    if (!error.isEmpty()) {
        return next
            (new httpError('invalid input passed ', 422));

    } */

    const { name, email, type } = req.body;

    const password = generator.generate({
        length: 10,
        numbers: true
    });
    let existinguser;
    try {

        existinguser = await Rlivraison.findOne({ email: email })

    } catch (err) {
        const error = new httpError('problems!!!', 500);
        return next(error)
    }

    if (existinguser) {
        const error = new httpError(
            'user exist',
            422
        );
        return next(error);
    }


    const createduser = new Rlivraison({

        name,
        email,
        password,
        type

    });

    try {
        await createduser.save();
    } catch (err) {
        const error = new httpError('failed signup', 500);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { adminId: createduser.id, email: createduser.email },
            'secret-thinks',
            { expiresIn: '1h' }
        );

    } catch (err) {
        const error = new httpError('failed signup try again later', 500);
        return next(error);

    }

    let mailOptions = {
        from: ' hezzilamia8@gmail.com', // TODO: email sender
        to: email, // TODO: email receiver
        subject: 'Création du compte responsable produit',
        text: 'Votre mots de passe est: ' + password
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return log('Error occurs');
        }
        return log('Email sent!!!');
    });




    res.status(201).json({ RProduit: createduser.id, email: createduser.email, token: token });


}

const login = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next
            (new httpError('invalid input passed', 422));
    }
    const { email, password } = req.body
    let existinguser
    try {
        existinguser = await Rlivraison.findOne({ email: email })
    }
    catch {
        return next
            (new httpError('failed!!', 500));
    }
    if ((!existinguser) || (existinguser.password !== password)) {
        return next
            (new httpError('invalid input password', 422))
    }
    let token;
    try {
        token = jwt.sign(
            { adminId: existinguser.id, email: existinguser.email },
            'secret-thinks',
            { expiresIn: '1h' }
        );

    } catch (err) {
        const error = new httpError('failed signup try again later', 500);
        return next(error);

    }
    res.status(200).json({ Rlivraison: existinguser, token: token })
   
}


const deleteRL = async (req, res, next) => {
    const id = req.params.id
    let existinguser

    try {
        existinguser = await Rlivraison.findById(id)
    } catch {

        return next
            (new httpError('failed ', 500));
    }
    if (!existinguser) {
        return next
            (new httpError('user does not exist', 500));
    }

    try {
        await existinguser.remove()

    } catch {
        return next
            (new httpError('failed !!!', 500));
    }
    res.status(200).json({ message: "deleted" })

}

const updateRL = async (req, res, next) => {

    const { name, email } = req.body;
    console.log(name, email)
    const id = req.params.id
    let existingRL;

    try {
        existingRL = await Rlivraison.findById(id)
    } catch {

        return next
            (new httpError('failed ', 500));
    }





    existingRL.name = name;
    existingRL.email = email;



    try {
        existingRL.save()
    } catch {
        return next
            (new httpError('failed to save ', 500));
    }

    res.status(200).json({ existingRL: existingRL })
}

const getResponsableLivraison = async (req, res, next) => {
    let existingRL;
    try {
        existingRL = await Rlivraison.find({}, '-pasword')
    } catch {
        const error = new httpError('failed signup', 500);
        return next(error);
    }
    res.json({ existingRL: existingRL })
}



exports.signup = signup

exports.login = login

exports.getResponsableLivraison = getResponsableLivraison
exports.deleteRL = deleteRL
exports.updateRL = updateRL