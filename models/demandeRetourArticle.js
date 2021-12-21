const mongoose =require("mongoose")
const schema = mongoose.Schema;

const demandeRetourArticleSchema = new schema({
    sujet:{type:String,required:true},
    idCommande:{type:String,required:true},
    idArticle:{type:String,required:true},
    prixAticle:{type:String,required:true},
    prixCommande:{type:String,required:true},
    nomArticle:{type:String,required:true},
    imageArticle:{type:String,required:true},
    valider:{type:Boolean,required:true},
})


module.exports = mongoose.model('demandeRetourArticle',demandeRetourArticleSchema)