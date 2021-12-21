const mongoose =require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const schema = mongoose.Schema;

const userSchema = new schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlenght:8},
    prixT:{type:Number,required:true},
    bloque:{type:String,required:true,minlenght:8},
    commandes:[{type:mongoose.Types.ObjectId,required:true,ref:'commande'}],
    favories:[{type:mongoose.Types.ObjectId,required:true,ref:'article'}],
    paniers:[{type:mongoose.Types.ObjectId,required:true,ref:'article'}]
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('user',userSchema)