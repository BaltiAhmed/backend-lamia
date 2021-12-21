const mongoose =require("mongoose")
const schema = mongoose.Schema;

const commandeSchema = new schema({
    idClient:{type:String,required:true},
    date:{type:String,required:true},
    prix:{type:Number,required:true},
    adresse:{type:String,required:true},
    gouvernerat:{type:String,required:true},
    statut:{type:String},
    produits:[{type:mongoose.Types.ObjectId,required:true,ref:'article'}]


})


module.exports = mongoose.model('commande',commandeSchema)