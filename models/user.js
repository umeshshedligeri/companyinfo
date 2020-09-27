const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema for employees
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company'
    },
    reportingManager: {
        type: Schema.Types.ObjectId,  //Who is reporting manager for employees
        ref: 'users'
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'admin'
    }
});

module.exports = User = mongoose.model('users', userSchema);