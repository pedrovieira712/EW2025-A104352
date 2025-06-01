var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var Log = require('../controllers/log');
var auth = require('../middleware/auth');

// GET /logs - listar todos (só admin)
router.get('/', auth, function(req, res) {
    if (req.user && req.user.isAdmin) {
        Log.list()
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    } else {
        res.status(403).jsonp({ error: "Acesso restrito a administradores" });
    }
});

// GET /logs/:_id - obter um log (só admin)
router.get('/:_id', auth, function(req, res) {
    if (req.user && req.user.isAdmin) {
        Log.lookUp(req.params._id)
            .then(data => res.status(200).jsonp(data))
            .catch(error => res.status(500).jsonp(error));
    } else {
        res.status(403).jsonp({ error: "Acesso restrito a administradores" });
    }
});

// GET /logs/user/:userId - logs por utilizador (admin ou próprio user)
router.get('/user/:userId', auth, function(req, res) {
    if (req.user && (req.user.isAdmin || req.user.id === req.params.userId)) {
        Log.listByUser(req.params.userId)
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    } else {
        res.status(403).jsonp({ error: "Acesso não autorizado" });
    }
});

// GET /logs/item/:itemId - logs por item (admin)
router.get('/item/:itemId', auth, function(req, res) {
    if (req.user && req.user.isAdmin) {
        Log.listByItem(req.params.itemId)
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    } else {
        res.status(403).jsonp({ error: "Acesso restrito a administradores" });
    }
});

// GET /logs/action/:action - logs por ação (admin)
router.get('/action/:action', auth, function(req, res) {
    if (req.user && req.user.isAdmin) {
        Log.listByAction(req.params.action)
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    } else {
        res.status(403).jsonp({ error: "Acesso restrito a administradores" });
    }
});

// GET /logs/stats - estatísticas (admin)
router.get('/stats/summary', auth, function(req, res) {
    if (req.user && req.user.isAdmin) {
        Log.getStats()
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    } else {
        res.status(403).jsonp({ error: "Acesso restrito a administradores" });
    }
});

// GET /logs/export - exportar logs para ficheiro (admin)
router.get('/export/file', auth, function(req, res) {
    if (req.user && req.user.isAdmin) {
        Log.exportLogs()
            .then(logs => {
                // Criar diretório se não existir
                const logsDir = path.join('uploads', 'logs');
                if (!fs.existsSync(logsDir)) {
                    fs.mkdirSync(logsDir, { recursive: true });
                }
                
                // Nome do ficheiro com timestamp
                const filename = `logs_${Date.now()}.json`;
                const filePath = path.join(logsDir, filename);
                
                // Escrever logs no ficheiro
                fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
                
                // Enviar ficheiro
                res.download(filePath, filename, (err) => {
                    if (err) {
                        console.error('Erro ao enviar ficheiro:', err);
                    }
                    
                    // Opcional: remover ficheiro após download
                    // fs.unlinkSync(filePath);
                });
            })
            .catch(error => res.status(500).jsonp(error));
    } else {
        res.status(403).jsonp({ error: "Acesso restrito a administradores" });
    }
});

module.exports = router;