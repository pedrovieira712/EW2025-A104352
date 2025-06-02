var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    type: { 
        type: String, 
        required: true,
        enum: ['photo', 'document', 'text', 'mixed', 'zip'] // Tipos suportados
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [String],
    isPublic: { type: Boolean, default: false }, // Por omissão privado
    
    // Metadados obrigatórios do enunciado
    createdAt: { type: Date, required: true }, // Data de criação
    submittedAt: { type: Date, default: Date.now }, // Data de submissão
    producer: { type: String, required: true }, // Identificação do produtor
    submitter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Ficheiros associados
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    
    // Para integração redes sociais
    sharedOn: {
        facebook: { shared: Boolean, url: String },
        twitter: { shared: Boolean, url: String },
        strava: { shared: Boolean, url: String }
    }
}, {versionKey: false});

module.exports = mongoose.model('Item', itemSchema);