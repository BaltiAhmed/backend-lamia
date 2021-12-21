const httpError = require("../models/error");

const user = require("../models/user");
const article = require("../models/article");
const commande = require("../models/commande");

const ajout = async (req, res, next) => {
  const { nom, description, stocke, categorie, ref, prix } = req.body;

  const creatdArticle = new article({
    nom,
    description,
    stocke,
    categorie,
    image: req.file.path,
    ref,
    prix,
  });

  try {
    await creatdArticle.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ Article: creatdArticle });
};

const updateArticle = async (req, res, next) => {
  const { nom, description, stocke, categorie, ref, prix } = req.body;
  const id = req.params.id;
  let existingArticle;

  try {
    existingArticle = await article.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingArticle.name = nom;
  existingArticle.email = description;
  existingArticle.stocke = stocke;
  existingArticle.ref = ref;
  existingArticle.categorie = categorie;
  existingArticle.image = req.file.path;
  existingArticle.prix = prix;

  try {
    existingArticle.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ article: existingArticle });
};

const deleteArticle = async (req, res, next) => {
  const id = req.params.id;
  let existingArticle;

  try {
    existingArticle = await article.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }
  if (!existingArticle) {
    return next(new httpError("article does not exist", 500));
  }

  try {
    await existingArticle.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const getArticle = async (req, res, next) => {
  let existingArticle;
  try {
    existingArticle = await article.find();
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingArticle: existingArticle });
};

const getArticleById = async (req, res, next) => {
  const id = req.params.id;
  let existingArticle;
  try {
    existingArticle = await article.findById(id);
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingArticle: existingArticle });
};

const ajoutArticlePanier = async (req, res, next) => {
  const { idArticle, idClient, prix } = req.body;

  let existingArticle;

  try {
    existingArticle = await article.findById(idArticle);
  } catch {
    return next(new httpError("failed article", 500));
  }

  let existingUser;

  try {
    existingUser = await user.findById(idClient);
  } catch {
    return next(new httpError("failed user", 500));
  }

  existingUser.prixT = prix + existingUser.prixT;

  try {
    existingUser.paniers.push(existingArticle);
    existingUser.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ panier: existingUser.paniers });
};

const SuprimerArticlePanier = async (req, res, next) => {
  const { idArticle, idClient, prix } = req.body;

  let existingArticle;

  try {
    existingArticle = await article.findById(idArticle);
  } catch {
    return next(new httpError("failed ", 500));
  }

  let existingUser;

  try {
    existingUser = await user.findById(idClient);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingUser.prixT = existingUser.prixT - prix;

  console.log(existingArticle._id);

  try {
    const index = existingUser.paniers.indexOf(existingArticle._id);
    existingUser.paniers.splice(index, 1);
    console.log(existingUser);
    existingUser.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ user: existingUser });
};

const getarticleByPanier = async (req, res, next) => {
  const id = req.params.id;

  let existingArticle;
  try {
    existingArticle = await user.findById(id).populate("paniers");
  } catch (err) {
    const error = new httpError("Fetching failed", 500);
    return next(error);
  }

  if (!existingArticle || existingArticle.paniers.length === 0) {
    return next(new httpError("could not find article for this id.", 404));
  }

  res.json({
    existingArticle: existingArticle.paniers.map((item) =>
      item.toObject({ getters: true })
    ),
  });
};

const getarticleByCommande = async (req, res, next) => {
  const id = req.params.id;

  let existingArticle;
  try {
    existingArticle = await commande.findById(id).populate("produits");
  } catch (err) {
    const error = new httpError("Fetching failed", 500);
    return next(error);
  }

  if (!existingArticle || existingArticle.produits.length === 0) {
    return next(new httpError("could not find article for this id.", 404));
  }

  res.json({
    existingArticle: existingArticle.produits.map((item) =>
      item.toObject({ getters: true })
    ),
  });
};

exports.ajout = ajout;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
exports.getArticle = getArticle;
exports.getArticleById = getArticleById;
exports.ajoutArticlePanier = ajoutArticlePanier;
exports.SuprimerArticlePanier = SuprimerArticlePanier;
exports.getarticleByPanier = getarticleByPanier;
exports.getarticleByCommande = getarticleByCommande;
