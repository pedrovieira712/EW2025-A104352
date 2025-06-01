var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    content: { type: String, required: true },
    
    // Tipo de comentário (para qualificar o item como pede o enunciado)
    type: {
        type: String,
        enum: ['note', 'context', 'application', 'correction', 'enhancement'],
        default: 'note'
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    
    // Para comentários aninhados (opcional)
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
}, {versionKey: false});

module.exports = mongoose.model('Comment', commentSchema);