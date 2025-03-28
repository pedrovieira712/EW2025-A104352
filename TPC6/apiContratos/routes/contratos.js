var express = require('express');
var router = express.Router();
var Contrato = require('../controllers/contrato')

/* GET todos contratos. */
router.get('/', function(req, res, next) {
  console.log(req.query)
  if(req.query.entidade && req.query.tipo){
    Contrato.getAllContractsFilterByEntidadeAndTipo(req.query.entidade, req.query.tipo)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
  } else if(req.query.entidade){
    Contrato.getAllContractsFilterByEntidade(req.query.entidade)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
  } else if(req.query.tipo){
    Contrato.getAllContractsFilterByTipo(req.query.tipo)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
  } else{
    Contrato.getAllContracts()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
  }
});

/* GET entidades */
router.get('/entidades', function(req, res, next) {
  Contrato.getEntidades()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

router.get('/entidades/:nipc', function(req, res, next) {
  Contrato.getContratosByNIPC(req.params.nipc)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

/* GET tipos */
router.get('/tipos', function(req, res, next) {
  Contrato.getTipos()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

/* get contrato por id */
router.get('/:id', function(req, res, next) {
  Contrato.getContractById(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

/* POST new contract*/
router.post('/', function(req, res, next) {
  Contrato.insert(req.body)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

/* PUT  contract*/
router.put('/:id', function(req, res, next) {
  Contrato.update(req.params.id, req.body)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

/* DELETe contract*/
router.delete('/:id', function(req, res, next) {
  Contrato.delete(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

module.exports = router;
