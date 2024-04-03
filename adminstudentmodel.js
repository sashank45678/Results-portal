const mongoose=require('mongoose')
const adminstschema=new mongoose.Schema({
    name:String,
    rollno:String,
})
module.exports=mongoose.model('adminstudent',adminstschema)