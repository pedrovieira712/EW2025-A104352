var express = require('express');
var router = express.Router();
var axios = require('axios');

const API_URL = 'http://localhost:25000';

// GET /login - Página de login
router.get('/login', function(req, res, next) {
  res.render('auth/login', { title: 'Login' });
});

// POST /login - Processar login
router.post('/login', function(req, res, next) {
  var credentials = {
    username: req.body.username,
    password: req.body.password
  };
  
  axios.post(API_URL + '/user/login', credentials)
    .then(resp => {
      var data = resp.data;
      // Guardar token na sessão
      req.session.token = data.token;
      req.session.user = data.user;
      res.redirect('/items/');
    })
    .catch(erro => {
      console.log(erro);
      res.render('auth/login', { 
        title: 'Login', 
        error: 'Credenciais inválidas' 
      });
    });
});

// GET /register - Página de registo
router.get('/register', function(req, res, next) {
  res.render('auth/register', { title: 'Registar' });
});

// POST /register - Processar registo
router.post('/register', function(req, res, next) {
  var userData = {
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  };
  
  axios.post(API_URL + '/user/register', userData)
    .then(resp => {
      var data = resp.data;
      // Guardar token na sessão
      req.session.token = data.token;
      req.session.user = data.user;
      res.redirect('/items/dashboard');
    })
    .catch(erro => {
      console.log(erro);
      res.render('auth/register', { 
        title: 'Registar', 
        error: 'Erro ao criar conta' 
      });
    });
});

// GET /logout - Logout
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;