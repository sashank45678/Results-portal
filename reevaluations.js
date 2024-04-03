const mongoose=require('mongoose')
const reevaluationSchema=new mongoose.Schema({
    admissionNumber:String,
    teacher:String,
    status:String,
    explanation:String,
    filePath:String,

})
module.exports=mongoose.model('reevaluations',reevaluationSchema)