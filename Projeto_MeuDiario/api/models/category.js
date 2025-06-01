var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    
    // Para hierarquia de categorias
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    level: { type: Number, default: 0 }, // 0=raiz, 1=subcategoria, etc
        
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
}, {versionKey: false});

module.exports = mongoose.model('Category', categorySchema);