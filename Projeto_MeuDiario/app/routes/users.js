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

// GET /profile - Ver perfil
router.get('/profile', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.get(API_URL + '/user/' + req.session.user.id, config)
    .then(resp => {
      var userData = resp.data;
      res.status(200);
      res.render('users/profile', { 
        title: 'Perfil', 
        user: req.session.user, 
        userData: userData 
      });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// GET /profile/edit - Editar perfil
router.get('/profile/edit', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.get(API_URL + '/user/' + req.session.user.id, config)
    .then(resp => {
      var userData = resp.data;
      res.status(200);
      res.render('users/edit', { 
        title: 'Editar Perfil', 
        user: req.session.user, 
        userData: userData 
      });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// POST /profile/edit - Processar edição
router.post('/profile/edit', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  var userData = {
    name: req.body.name,
    email: req.body.email
  };
  
  // Se tiver nova password
  if (req.body.password && req.body.password.trim() !== '') {
    userData.password = req.body.password;
  }
  
  axios.put(API_URL + '/user/' + req.session.user.id, userData, config)
    .then(resp => {
      // Atualizar dados na sessão
      req.session.user.name = userData.name;
      req.session.user.email = userData.email;
      res.redirect('/users/profile');
    })
    .catch(erro => {
      console.log(erro);
      res.render('users/edit', { 
        title: 'Editar Perfil', 
        user: req.session.user, 
        error: 'Erro ao atualizar perfil' 
      });
    });
});

// GET /comments - Meus comentários
router.get('/comments', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.get(API_URL + '/comment/user/' + req.session.user.id, config)
    .then(resp => {
      var comments = resp.data;
      res.status(200);
      res.render('users/comments', { 
        title: 'Meus Comentários', 
        user: req.session.user, 
        comments: comments 
      });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// POST /comments/:id/delete - Eliminar comentário
router.post('/comments/:id/delete', function(req, res, next) {
  var id = req.params.id;
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.delete(API_URL + '/comment/' + id, config)
    .then(resp => {
      res.redirect('/users/comments');
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// GET /items - Meus items
router.get('/items', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.get(API_URL + '/item?submitter=' + req.session.user.id, config)
    .then(resp => {
      var items = resp.data;
      res.status(200);
      res.render('users/items', { 
        title: 'Meus Items', 
        user: req.session.user, 
        items: items 
      });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

module.exports = router;