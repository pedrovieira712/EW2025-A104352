var express = require('express');
var router = express.Router();
var axios = require('axios');

function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Engenharia Web 2025',
                        docente: 'JCR',
                        instituicao: 'Uminho'
  });
});

router.get('/filmes', function(req, res) {
  axios.get('http://localhost:3000/filmes')
    .then(resp => {
      res.render('filmes', {lfilmes: resp.data, tit: "Lista de Filmes"})
    })
    .catch(erro => {
      console.log(erro)
      res.render('error', {error: erro})
    })
});

router.get('/filmes/delete/:id', function(req, res) {
  axios.delete('http://localhost:3000/filmes/' + req.params.id)
  .then(res.redirect('/filmes'))  
  .catch(erro => {
      console.log(erro)
      res.render('error', {error: erro})
    })
});

router.get('/filmes/edit/:id', function(req, res) {
  axios.get('http://localhost:3000/filmes/' + req.params.id)
  .then(resp => {
    res.render('filme_edit', {filme: resp.data})
  }) 
  .catch(erro => {
      console.log(erro)
      res.render('error', {error: erro})
    })
});

router.post('/filmes/update/:id', async (req, res) => {
  try {
      const filmeId = req.params.id;
      const { title, year, cast, genres } = req.body;

      const castArray = cast.split(',').map(s => s.trim());
      const genresArray = genres.split(',').map(s => s.trim());

      const updatedFilme = {
          title,
          year: parseInt(year),
          cast: castArray,
          genres: genresArray
      };

      await axios.put(`http://localhost:3000/filmes/${filmeId}`, updatedFilme);
      res.redirect('/filmes');
  } catch (error) {
      console.error('Erro ao atualizar filme:', error);
      res.status(500).send('Erro ao atualizar o filme');
  }
});

router.get('/filmes/autor/:nome', function(req, res) {
  axios.get(`http://localhost:3000/filmes`)
  .then(resp => {
    filmes_autor = resp.data.filter(f => f.cast.includes(req.params.nome))
    res.render('ator', {filmes: filmes_autor, autor: req.params.nome})
  }) 
  .catch(erro => {
      console.log(erro)
      res.render('error', {error: erro})
    })
});


module.exports = router;