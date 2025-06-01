var mongoose = require('mongoose');

var fileSchema = new mongoose.Schema({
    originalName: { type: String, required: true },
    filename: { type: String, required: true }, // Nome no filesystem
    path: { type: String, required: true }, // Caminho completo
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    encoding: String,
    
    // Referência ao item
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    
    // Metadados do SIP
    sipManifest: String, // Referência ao manifesto original
    
    uploadedAt: { type: Date, default: Date.now },
    
    // Para diferentes tipos de ficheiro
    fileType: {
        type: String,
        enum: ['image', 'document', 'text', 'video', 'audio', 'archive', 'other']
    }
}, {versionKey: false});

module.exports = mongoose.model('File', fileSchema);