var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },

    // Para autenticação social (passport)
    facebookId: String,
    googleId: String,
    profilePicture: String
}, {versionKey: false});

module.exports = mongoose.model('User', userSchema);