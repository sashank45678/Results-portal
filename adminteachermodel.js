const mongoose=require('mongoose')
const admintcschema=new mongoose.Schema({
    name:String,
    subject:String,
})
module.exports=mongoose.model('adminteacher',admintcschema)