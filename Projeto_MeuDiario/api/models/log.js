var mongoose = require('mongoose');

var logSchema = new mongoose.Schema({
    action: { 
        type: String, 
        required: true,
        enum: ['view', 'download', 'upload', 'create', 'update', 'delete', 'login', 'logout', 'share']
    },
    
    // Referências
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Dados da sessão
    ip: String,
    userAgent: String,
    sessionId: String,
    
    // Detalhes específicos da ação
    details: {
        fileDownloaded: String,
        exportFormat: String,
        searchQuery: String,
        errorMessage: String,
        duration: Number // Para ações que demoram tempo
    },
    
    timestamp: { type: Date, default: Date.now },
    
    // Para estatísticas
    processed: { type: Boolean, default: false }
}, {versionKey: false});

module.exports = mongoose.model('Log', logSchema);