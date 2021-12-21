//require express
const express = require('express');
//const app of express
const app = express();
const bodyParser = require('body-parser');
const path = require('path');


const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const commandeRoutes = require('./routes/commande')
const articleRoutes = require('./routes/article')
const RlivraisonRoutes = require('./routes/responsable-livraison')
const RProduitRoutes = require('./routes/responsable-produit')
const livreur = require('./routes/livreur')
const demandeRetourArticleRoute = require('./routes/demandeRetourArticle')

const httperror = require('./models/error');

const mongoose = require('mongoose');
//importe les routes
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/commande', commandeRoutes)
app.use('/api/article', articleRoutes)
app.use('/api/RLivraison',RlivraisonRoutes)
app.use('/api/RProduit',RProduitRoutes)
app.use('/api/livreur',livreur)
app.use('/api/demandeRetourArticle',demandeRetourArticleRoute)




app.use((req, res, next) => {
    const error = new httperror('could not find that page', 404);
    throw error;
})

app.use((error, req, res, next) => {
    if (res.headerSent) {

        return next(error)
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'an unknown error occurred ' })
})
// connection  database
mongoose
    .connect('mongodb+srv://produits:admin@cluster0.0fy39.mongodb.net/produits?retryWrites=true&w=majority')
    .then(() => {
        // create server
        app.listen(5000);
    })
    .catch(err => {
        console.log(err)

    })


