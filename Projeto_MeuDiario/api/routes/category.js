var express = require('express');
var router = express.Router();

var Category = require('../controllers/category');
var auth = require('../middleware/auth');

// GET /categories - listar todas (público)
router.get('/', function(req, res) {
    Category.list()
        .then(data => {res.status(200).jsonp(data);})
        .catch(error => res.status(500).jsonp(error));
});

// GET /categories/:_id - obter uma categoria
router.get('/:_id', function(req, res) {
    Category.lookUp(req.params._id)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error));
});

// POST /categories - criar nova (só autenticados)
router.post('/', auth, function(req, res) {
    if (req.user) {
        Category.create(req.body)
            .then(data => {
                res.status(201).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    }
});

// PUT /categories/:_id - atualizar (só autenticados)
router.put('/:_id', auth, function(req, res) {
    if (req.user) {
        Category.update(req.params._id, req.body)
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    }
});

// DELETE /categories/:_id - eliminar (só autenticados)
router.delete('/:_id', auth, function(req, res) {
    if (req.user) {
        Category.delete(req.params._id)
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    }
});

module.exports = router;