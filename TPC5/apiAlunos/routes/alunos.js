var express = require('express');
var router = express.Router();
var Aluno = require('../controllers/aluno')

/* GET alunos */
router.get('/', function(req, res, next) {
  Aluno.list()
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error))
});

router.get('/:id', function(req, res, next) {
  Aluno.findById(req.params.id)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error))
});

/* POST */
router.post('/', function(req, res, next) {
  Aluno.insert(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(error => res.jsonp(error))
});

/* PUT aluno */
router.put('/:id', function(req, res, next) {
  Aluno.update(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error))
});


/* DELETE aluno */
router.delete('/:id', function(req, res, next) {
  Aluno.delete(req.params.id)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error))
});


router.put('/:idAluno/tpc/:idTpc', function(req, res, next) {
  Aluno.inverteTpc(req.params.idAluno, req.params.idTpc)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error))
});

module.exports = router;
