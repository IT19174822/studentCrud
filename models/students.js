const mongoose = require ('mongoose');
const studentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    contact:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
   

    created:{
        type: Date,
        required: true,
        default: Date.now
    }

});
module.exports = mongoose.model('Student',studentSchema);