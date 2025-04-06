var express = require('express');
const axios = require('axios')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get("http://localhost:17000/books/")
  .then(resp => {
    data = resp.data
    res.status(200)
    res.render('inicioPagina', { livros: data });
  })
  .catch(erro => {
    console.log(erro)
    res.render('error', {error: erro})
  })
});

router.get('/entidades/:idAutor', function(req, res, next) {
  var id = req.params.idAutor
  axios.get("http://localhost:17000/books?autor=" + id)
  .then(resp => {
    data = resp.data
    res.status(200)
    res.render('autorPagina', { autor : data });
  })
  .catch(erro => {
    console.log(erro)
    res.render('error', {error: erro})
  })
});

router.get('/:id', function(req, res, next) {
  var id = req.params.id
  axios.get("http://localhost:17000/books/" + id)
  .then(resp => {
    data = resp.data
    res.status(200)
    res.render('livroPagina', { livro: data });
  })
  .catch(erro => {
    console.log(erro)
    res.render('error', {error: erro})
  })
});

module.exports = router;