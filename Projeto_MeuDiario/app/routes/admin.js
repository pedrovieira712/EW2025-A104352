var express = require('express');
var router = express.Router();
var axios = require('axios');

const API_URL = 'http://localhost:25000';

router.use(requireAuth);
router.use(requireAdmin);

// Middleware de autenticação
function requireAuth(req, res, next) {
  if (req.session && req.session.token) {
    next();
  } else {
    res.redirect('/auth/login');
  }
}

// Middleware de admin
function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    res.status(403).render('error', { 
      error: { message: 'Acesso restrito a administradores' } 
    });
  }
}


// GET /admin - Dashboard admin
router.get('/', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  Promise.all([
    axios.get(API_URL + '/user', config),
    axios.get(API_URL + '/item', config),
    axios.get(API_URL + '/category', config),
    axios.get(API_URL + '/log/stats/summary', config)
  ])
  .then(responses => {
    var users = responses[0].data;
    var items = responses[1].data;
    var categories = responses[2].data;
    var stats = responses[3].data;
    
    res.status(200);
    res.render('admin/dashboard', { 
      title: 'Administração', 
      user: req.session.user,
      stats: {
        users: users.length,
        items: items.length,
        categories: categories.length,
        logs: stats.total
      }
    });
  })
  .catch(erro => {
    console.log(erro);
    res.render('error', { error: erro });
  });
});

// GET /admin/users - Gestão utilizadores
router.get('/users', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.get(API_URL + '/user', config)
    .then(resp => {
      var users = resp.data;
      res.status(200);
      res.render('admin/users', { 
        title: 'Gestão Utilizadores', 
        user: req.session.user, 
        users: users 
      });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// GET /admin/users/:id - Ver utilizador
router.get('/users/:id', function(req, res, next) {
  var id = req.params.id;
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.get(API_URL + '/user/' + id, config)
    .then(resp => {
      var userData = resp.data;
      res.status(200);
      res.render('admin/user-detail', { 
        title: 'Detalhes Utilizador', 
        user: req.session.user, 
        userData: userData 
      });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// POST /admin/users/:id/delete - Eliminar utilizador
router.post('/users/:id/delete', function(req, res, next) {
  var id = req.params.id;
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.delete(API_URL + '/user/' + id, config)
    .then(resp => {
      res.redirect('/admin/users');
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// GET /admin/categories - Gestão categorias
router.get('/categories', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.get(API_URL + '/category', config)
    .then(resp => {
      var categories = resp.data;
      res.status(200);
      res.render('admin/categories', { 
        title: 'Gestão Categorias', 
        user: req.session.user, 
        categories: categories 
      });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// GET /admin/categories/new - Nova categoria
router.get('/categories/new', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.get(API_URL + '/category', config)
    .then(resp => {
      var categories = resp.data; // Para selecionar parent
      res.status(200);
      res.render('admin/category-new', { 
        title: 'Nova Categoria', 
        user: req.session.user, 
        categories: categories 
      });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// POST /admin/categories/new - Processar nova categoria
router.post('/categories/new', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  var categoryData = {
    name: req.body.name,
    description: req.body.description,
    color: req.body.color
  };
  
  if (req.body.parent && req.body.parent !== '') {
    categoryData.parent = req.body.parent;
  }
  
  axios.post(API_URL + '/category', categoryData, config)
    .then(resp => {
      res.redirect('/admin/categories');
    })
    .catch(erro => {
      console.log(erro);
      res.render('admin/category-new', { 
        title: 'Nova Categoria', 
        user: req.session.user, 
        error: 'Erro ao criar categoria' 
      });
    });
});

// GET /admin/categories/:id/edit - Editar categoria
router.get('/categories/:id/edit', function(req, res, next) {
  var id = req.params.id;
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  Promise.all([
    axios.get(API_URL + '/category/' + id, config),
    axios.get(API_URL + '/category', config)
  ])
  .then(responses => {
    var category = responses[0].data;
    var categories = responses[1].data;
    res.status(200);
    res.render('admin/category-edit', { 
      title: 'Editar Categoria', 
      user: req.session.user, 
      category: category,
      categories: categories.filter(c => c._id !== id) // Excluir a própria categoria
    });
  })
  .catch(erro => {
    console.log(erro);
    res.render('error', { error: erro });
  });
});

// POST /admin/categories/:id/edit - Processar edição
router.post('/categories/:id/edit', function(req, res, next) {
  var id = req.params.id;
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  var categoryData = {
    name: req.body.name,
    description: req.body.description,
    color: req.body.color
  };
  
  if (req.body.parent && req.body.parent !== '') {
    categoryData.parent = req.body.parent;
  }
  
  axios.put(API_URL + '/category/' + id, categoryData, config)
    .then(resp => {
      res.redirect('/admin/categories');
    })
    .catch(erro => {
      console.log(erro);
      res.render('admin/category-edit', { 
        title: 'Editar Categoria', 
        user: req.session.user, 
        error: 'Erro ao atualizar categoria' 
      });
    });
});

// POST /admin/categories/:id/delete - Eliminar categoria
router.post('/categories/:id/delete', function(req, res, next) {
  var id = req.params.id;
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.delete(API_URL + '/category/' + id, config)
    .then(resp => {
      res.redirect('/admin/categories');
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// GET /admin/logs - Logs do sistema
router.get('/logs', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.get(API_URL + '/log', config)
    .then(resp => {
      var logs = resp.data;
      res.status(200);
      res.render('admin/logs', { 
        title: 'Logs do Sistema', 
        user: req.session.user, 
        logs: logs 
      });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// GET /admin/stats - Estatísticas
router.get('/stats', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.get(API_URL + '/log/stats/summary', config)
    .then(resp => {
      var stats = resp.data;
      res.status(200);
      res.render('admin/stats', { 
        title: 'Estatísticas', 
        user: req.session.user, 
        stats: stats 
      });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// GET /admin/logs/export - Exportar logs
router.get('/logs/export', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token },
    responseType: 'stream'
  };
  
  axios.get(API_URL + '/log/export/file', config)
    .then(resp => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="logs.json"');
      resp.data.pipe(res);
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

module.exports = router;