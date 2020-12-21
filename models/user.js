const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
     fullname: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
      },
      password: {
        type: String,
        required: true
      },
      gender: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        required: false
      },

},{runSettersOnQuery: true})
module.exports = mongoose.model('User',userSchema)