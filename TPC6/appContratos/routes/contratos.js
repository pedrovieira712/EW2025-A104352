var express = require('express');
const axios = require('axios')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get("http://localhost:16000/contratos")
  .then(resp => {
    data = resp.data
    res.status(200)
    res.render('index', { contratos: data });
  })
  .catch(erro => {
    console.log(erro)
    res.render('error', {error: erro})
  })
});

router.get('/:id', function(req, res, next) {
  var id = req.params.id
  axios.get("http://localhost:16000/contratos/" + id)
  .then(resp => {
    data = resp.data
    res.status(200)
    res.render('contrato', { contrato: data });
  })
  .catch(erro => {
    console.log(erro)
    res.render('error', {error: erro})
  })
});

router.get('/entidades/:nipc', function(req, res, next) {
  var nipc = req.params.nipc
  axios.get("http://localhost:16000/contratos/entidades/" + nipc)
  .then(resp => {
    data = resp.data
    res.status(200)
    res.render('entidade', { contratos: data });
  })
  .catch(erro => {
    console.log(erro)
    res.render('error', {error: erro})
  })
});

module.exports = router;