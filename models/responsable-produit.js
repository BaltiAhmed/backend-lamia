
const mongoose =require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const schema = mongoose.Schema;

const RPSchema = new schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlenght:8},
    type:{type:String,required:true},

    
})

RPSchema.plugin(uniqueValidator)

module.exports = mongoose.model('RProduit',RPSchema)