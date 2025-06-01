var express = require('express');
var router = express.Router();
var axios = require('axios');
var multer = require('multer');
var FormData = require('form-data');
var fs = require('fs');

const API_URL = 'http://localhost:25000';

// Configuração multer
var upload = multer({ dest: 'uploads/temp/' });

// Middleware de autenticação
function requireAuth(req, res, next) {
  if (req.session && req.session.token) {
    next();
  } else {
    res.redirect('/auth/login');
  }
}

router.use(requireAuth);

// GET /upload - Página de upload
router.get('/upload', function(req, res, next) {
  res.render('sip/upload', { 
    title: 'Upload SIP', 
    user: req.session.user 
  });
});

// POST /upload - Processar upload
router.post('/upload', upload.single('zipFile'), function(req, res, next) {
  if (!req.file) {
    return res.render('sip/upload', { 
      title: 'Upload SIP', 
      user: req.session.user, 
      error: 'Nenhum ficheiro selecionado' 
    });
  }
  
  // Criar FormData para enviar ficheiro
  var formData = new FormData();
  formData.append('zipFile', fs.createReadStream(req.file.path), req.file.originalname);
  
  var config = {
    headers: { 
      'Authorization': 'Bearer ' + req.session.token,
      ...formData.getHeaders()
    }
  };
  
  axios.post(API_URL + '/sip/upload', formData, config)
    .then(resp => {
      // Limpar ficheiro temporário
      fs.unlinkSync(req.file.path);
      res.redirect('/sip/processed');
    })
    .catch(erro => {
      console.log(erro);
      // Limpar ficheiro temporário
      fs.unlinkSync(req.file.path);
      res.render('sip/upload', { 
        title: 'Upload SIP', 
        user: req.session.user, 
        error: 'Erro ao processar SIP' 
      });
    });
});

// GET /processed - SIPs processados
router.get('/processed', function(req, res, next) {
  var config = {
    headers: { 'Authorization': 'Bearer ' + req.session.token }
  };
  
  axios.get(API_URL + '/sip/processed', config)
    .then(resp => {
      var items = resp.data;
      res.status(200);
      res.render('sip/processed', { 
        title: 'SIPs Processados', 
        user: req.session.user, 
        items: items 
      });
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

// GET /export/:id - Exportar DIP
router.get('/export/:id', function(req, res, next) {
  var id = req.params.id;
  
  axios.get(API_URL + '/sip/export/' + id, { responseType: 'stream' })
    .then(resp => {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="item_' + id + '.zip"');
      resp.data.pipe(res);
    })
    .catch(erro => {
      console.log(erro);
      res.render('error', { error: erro });
    });
});

module.exports = router;