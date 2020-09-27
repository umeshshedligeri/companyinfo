const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const companySchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    NoOfEmployes: {
        type: Number
    },
    location: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String   //IT  // Manufacturing
    },
    established_In: {
        type: Number    // Year
    }
});

module.exports = company = mongoose.model('company', companySchema);