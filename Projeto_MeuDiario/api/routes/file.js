var express = require('express');
var router = express.Router();

var File = require('../controllers/file');
var auth = require('../middleware/auth');

// GET /files - listar todos (só autenticados)
router.get('/', auth, function(req, res) {
    if (req.user) {
        File.list()
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    }
});

// GET /files/:_id - obter um ficheiro
router.get('/:_id', function(req, res) {
    File.lookUp(req.params._id)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error));
});

// GET /files/download/:_id - download de ficheiro
router.get('/download/:_id', function(req, res) {
    File.lookUp(req.params._id)
        .then(file => {
            if (file) {
                res.download(file.path, file.originalName);
            } else {
                res.status(404).jsonp({ error: "Ficheiro não encontrado" });
            }
        })
        .catch(error => res.status(500).jsonp(error));
});

// DELETE /files/:_id - eliminar ficheiro (só autenticados)
router.delete('/:_id', auth, function(req, res) {
    if (req.user) {
        File.delete(req.params._id)
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    }
});

module.exports = router;