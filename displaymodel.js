const mongoose = require('mongoose');
const ExistingModel = require('./adminstudentmodel'); 

const newSchema = new mongoose.Schema({
    name: String,
    rollno: String,
    section:String,
    marks: {
        oose: { type: Number, default: 0 },
        wt: { type: Number, default: 0 },
        ml: { type: Number, default: 0 },
        java: { type: Number, default: 0 }
    }
});
const NewModel = mongoose.model('NewModel', newSchema);
module.exports = NewModel;
