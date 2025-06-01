var express = require('express');
var router = express.Router();
var axios = require('axios');

const API_URL = 'http://localhost:25000';

// Middleware de autenticação
function requireAuth(req, res, next) {
  if (req.session && req.session.token) {
    next();
  } else {
    res.redirect('/auth/login');
  }
}

router.use(requireAuth);

// GET /private - Items privados
router.get('/private', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.get(API_URL + '/item?private=true', config)
    .then(resp => {
      var items = resp.data;
      res.status(200);
      res.render('items/private', { 
        title: 'Items Privados', 
        user: req.session.user, 
        items: items 
      });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// GET /new - Criar novo item
router.get('/new', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.get(API_URL + '/category', config)
    .then(resp => {
      var categories = resp.data;
      res.status(200);
      res.render('items/new', { 
        title: 'Novo Item', 
        user: req.session.user, 
        categories: categories 
      });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// POST /new - Processar novo item
router.post('/new', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  var itemData = {
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    category: req.body.category,
    producer: req.body.producer,
    isPublic: req.body.isPublic === 'on',
    createdAt: req.body.createdAt
  };
  
  axios.post(API_URL + '/item', itemData, config)
    .then(resp => {
      res.redirect('/items/');
    })
    .catch(erro => {
      console.log(erro);
      res.render('items/new', { 
        title: 'Novo Item', 
        user: req.session.user, 
        error: 'Erro ao criar item' 
      });
    });
});

// GET /edit/:id - Editar item
router.get('/edit/:id', function(req, res, next) {
  var id = req.params.id;
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  Promise.all([
    axios.get(API_URL + '/item/' + id, config),
    axios.get(API_URL + '/category', config)
  ])
  .then(responses => {
    var item = responses[0].data;
    var categories = responses[1].data;
    res.status(200);
    res.render('items/edit', { 
      title: 'Editar Item', 
      user: req.session.user, 
      item: item, 
      categories: categories 
    });
  })
  .catch(erro => {
    console.log(erro);
    res.render('error', { error: erro });
  });
});

// POST /edit/:id - Processar edição
router.post('/edit/:id', function(req, res, next) {
  var id = req.params.id;
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  var itemData = {
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    category: req.body.category,
    isPublic: req.body.isPublic === 'on'
  };
  
  axios.put(API_URL + '/item/' + id, itemData, config)
    .then(resp => {
      res.redirect('/items/');
    })
    .catch(erro => {
      console.log(erro);
      res.render('items/edit', { 
        title: 'Editar Item', 
        user: req.session.user, 
        error: 'Erro ao editar item' 
      });
    });
});

// GET /items/:id - Ver item público
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  
  // Buscar item e comentários
  Promise.all([
    axios.get(API_URL + '/item/' + id),
    axios.get(API_URL + '/comment/item/' + id)
  ])
  .then(responses => {
    var item = responses[0].data;
    var comments = responses[1].data;
    res.status(200);
    res.render('items/view', { 
      title: item.title, 
      item: item, 
      user: req.session.user,
      comments: comments 
    });
  })
  .catch(erro => {
    console.log(erro);
    res.render('error', { error: erro });
  });
});

module.exports = router;