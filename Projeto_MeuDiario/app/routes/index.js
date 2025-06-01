var express = require('express');
var router = express.Router();
var axios = require('axios');

const API_URL = 'http://localhost:25000'; 

// GET / - Página inicial (timeline pública)
router.get('/', function(req, res, next) {
  axios.get(API_URL  + '/item')
    .then(resp => {
      var items = resp.data;
      res.status(200);
      res.render('index', { title: 'Diário Digital', items: items, user: req.session.user });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// GET /items - Items públicos
router.get('/items', function(req, res, next) {
  axios.get(API_URL + '/item')
    .then(resp => {
      var items = resp.data;
      res.status(200);
      res.render('items/public', { title: 'Conteúdos Públicos', items: items, user: req.session.user });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

router.get('/timeline', function(req, res, next) {
  axios.get(API_URL + '/item')
    .then(resp => {
      var items = resp.data;
      res.status(200);
      res.render('timeline', { title: 'Conteúdos Públicos', items: items, user: req.session.user });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});


// GET /categories - Lista de categorias
router.get('/categories', function(req, res, next) {
  axios.get(API_URL + '/category')
    .then(resp => {
      var categories = resp.data;
      res.status(200);
      res.render('categories/list', { title: 'Categorias', categories: categories, user: req.session.user });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// GET /categories/:id - Items por categoria
router.get('/categories/:id', function(req, res, next) {
  var id = req.params.id;
  
  Promise.all([
    axios.get(API_URL + '/category/' + id),
    axios.get(API_URL + '/item/category/' + id)
  ])
  .then(responses => {
    var category = responses[0].data;
    var items = responses[1].data;
    res.status(200);
    res.render('categories/items', { 
      title: category.name, 
      category: category, 
      items: items,
      user: req.session.user
    });
  })
  .catch(erro => {
    console.log(erro);
    res.render('error', { error: erro });
  });
});

// GET /search - Pesquisa
router.get('/search', function(req, res, next) {
  var query = req.query.q || '';
  
  if (query) {
    axios.get(API_URL + '/item?search=' + encodeURIComponent(query))
      .then(resp => {
        var items = resp.data;
        res.status(200);
        res.render('search', { title: 'Pesquisar', query: query, items: items, user: req.session.user });
      })
      .catch(erro => {
        console.log(erro);
        res.render('error', { error: erro });
      });
  } else {
    res.render('search', { title: 'Pesquisar', query: '', items: [], user: req.session.user });
  }
});

module.exports = router;