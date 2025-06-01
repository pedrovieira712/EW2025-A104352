var express = require('express');
var router = express.Router();

var Item = require('../controllers/item');
var auth = require('../middleware/auth');

// GET /items - listar todos (públicos para não autenticados, todos para autenticados)
router.get('/', function(req, res) {
    var token = req.get('Authorization');
    var showAll = false;
    
    if (token) {
        showAll = true; // Se autenticado, mostra todos
    }
    
    Item.list(showAll)
        .then(data => {res.status(200).jsonp(data);})
        .catch(error => res.status(500).jsonp(error));
});

// GET /items/:_id - obter um item
router.get('/:_id', function(req, res) {
    Item.lookUp(req.params._id)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error));
});

// POST /items - criar novo (só autenticados)
router.post('/', auth, function(req, res) {
    if (req.user) {
        req.body.submitter = req.user.id;
        
        Item.create(req.body)
            .then(data => {
                res.status(201).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    }
});

// PUT /items/:_id - atualizar (só autenticados)
router.put('/:_id', auth, function(req, res) {
    if (req.user) {
        Item.update(req.params._id, req.body)
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    }
});

// DELETE /items/:_id - eliminar (só autenticados)
router.delete('/:_id', auth, function(req, res) {
    if (req.user) {
        Item.delete(req.params._id)
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    }
});

// GET /items/category/:categoryId - filtrar por categoria
router.get('/category/:categoryId', function(req, res) {
    Item.listByCategory(req.params.categoryId)
        .then(data => {
            res.status(200).jsonp(data);
        })
        .catch(error => res.status(500).jsonp(error));
});

router.get('/new', function(req, res) {
    Item.list(true)
        .then(data => {res.status(200).jsonp(data);})
        .catch(error => res.status(500).jsonp(error));
});

module.exports = router;