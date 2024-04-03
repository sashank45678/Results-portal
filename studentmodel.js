const mongoose=require('mongoose')
const studentSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    admissionnumber:String
})
module.exports=mongoose.model('student',studentSchema)