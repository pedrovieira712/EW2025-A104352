var express = require('express');
var router = express.Router();
var Livro = require('../controllers/livro')

router.get('/', function(req, res, next){
  if (req.query.character) {
    Livro.getLivrosByCharacter(req.query.character)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
  }
  else if (req.query.autor) {
    Livro.getLivrosByAutor(req.query.autor)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
  } 
  else if (req.query.genre) {
    Livro.getLivrosByGenre(req.query.genre)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
  } 
  else {
    Livro.list()
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
  }
})

router.get('/genres', function(req, res, next){
  Livro.getAllGenres()
  .then(data => res.status(200).jsonp(data))
  .catch(erro => res.status(500).jsonp(erro))
})

router.get('/characters', function(req, res, next){
  Livro.getAllCharacters()
  .then(data => res.status(200).jsonp(data))
  .catch(erro => res.status(500).jsonp(erro))
})

router.get('/:id', function(req, res, next){
  var id = req.params.id
  Livro.findById(id)
  .then(data => res.status(200).jsonp(data))
  .catch(erro => res.status(500).jsonp(erro))
})

router.post('/', function(req, res, next) {
  Livro.insert(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.put('/:id', function(req, res, next) {
  var id = req.params.id;
  Livro.update(id, req.body)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.delete('/:id', function(req, res, next) {
  var id = req.params.id;
  Livro.delete(id)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

module.exports = router;

