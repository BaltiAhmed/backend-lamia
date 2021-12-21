const mongoose =require("mongoose")
const schema = mongoose.Schema;

const articleSchema = new schema({
    nom:{type:String,required:true},
    description:{type:String,required:true},
    stocke:{type:Number,required:true},
    categorie:{type:String,required:true},
    image:{type:String,required:true},
    ref:{type:Number,required:true},
    prix:{type:Number,required:true} 
})


module.exports = mongoose.model('article',articleSchema)