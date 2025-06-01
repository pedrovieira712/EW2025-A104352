var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var multer = require('multer');

var User = require('../controllers/user');
var auth = require('../middleware/auth');

// POST /users/register - registar
router.post('/register', function(req, res) {
    User.register(req.body)
        .then(data => {
            res.status(201).jsonp(data);
        })
        .catch(error => res.status(500).jsonp(error));
});

// POST /users/login - login
router.post('/login', function(req, res) {
    User.login(req.body)
        .then(data => {
            res.status(200).jsonp(data);
        })
        .catch(error => res.status(401).jsonp(error));
});

// GET /users - listar todos
router.get('/', auth, function(req, res) {
    if (req.user) {
        User.list()
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    }
});

// GET /users/:_id - obter um
router.get('/:_id', auth, function(req, res) {
    if (req.user) {
        User.lookUp(req.params._id)
            .then(data => res.status(200).jsonp(data))
            .catch(error => res.status(500).jsonp(error));
    }
});

// POST /users - criar novo
router.post('/', auth, function(req, res) {
    if (req.user) {
        User.create(req.body)
            .then(data => {
                res.status(201).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    }
});

// PUT /users/:_id - atualizar
router.put('/:_id', auth, function(req, res) {
    if (req.user) {
        User.update(req.params._id, req.body)
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    }
});

// DELETE /users/:_id - eliminar
router.delete('/:_id', auth, function(req, res) {
    if (req.user) {
        User.delete(req.params._id)
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    }
});

module.exports = router;