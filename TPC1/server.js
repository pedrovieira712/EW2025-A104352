const http = require('http');
const axios = require('axios');
const url = require('url');

const pages = require('./pages.js');

http.createServer((req, res) => {
    switch (req.method) {
        case 'GET':
            if (req.url === '/'){
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write(pages.gerarPaginaPrincipal());
                res.end();
            } else if (req.url.startsWith('/reparacoes')) {
                const parsedUrl = url.parse(req.url, true);
                const paginaAtual = parseInt(parsedUrl.query.pagina) || 1;

                const nif = parsedUrl.query.nif;
                const data = parsedUrl.query.data;
                const matricula = parsedUrl.query["viatura.matricula"];     

                if(nif != null){
                    axios.get('http://localhost:3000/reparacoes?nif='+nif)
                    .then(resp => {
                        const reparacoes = resp.data;
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write(pages.gerarPaginaIndividual(reparacoes)); // Passar o array completo
                        res.end(); 
                    })
                    .catch(err => {
                        console.error('Erro ao buscar os clientes:', err.message);
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write('<h1>Erro interno do servidor</h1>');
                        res.end();
                    });
                } else if(data != null){
                    axios.get('http://localhost:3000/reparacoes?data='+data)
                    .then(resp => {
                        const data = resp.data;
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write(pages.gerarPaginaPorData(data)); // Passar o array completo
                        res.end(); 
                    })
                    .catch(err => {
                        console.error('Erro ao buscar os clientes:', err.message);
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write('<h1>Erro interno do servidor</h1>');
                        res.end();
                    });
                } else if(matricula != null) {
                    axios.get('http://localhost:3000/reparacoes?viatura.matricula='+matricula)
                    .then(resp => {
                        const reparacoes = resp.data;
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write(pages.gerarPaginaIndividual(reparacoes)); // Passar o array completo
                        res.end(); 
                    })
                    .catch(err => {
                        console.error('Erro ao buscar os clientes:', err.message);
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write('<h1>Erro interno do servidor</h1>');
                        res.end();
                    });
                } else {
                    axios.get(`http://localhost:3000/reparacoes?_page=${paginaAtual}&_per_page=50&_sort=nome`)
                    .then(resp => {
                        const reparacoes = resp.data.data; 
                        const totalPaginas = resp.data.pages;
                        
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write(pages.gerarPaginaReparacoes(reparacoes, paginaAtual, totalPaginas));
                        res.end();  
                    })
                    .catch(err => {
                        console.error('Erro ao buscar os clientes:', err.message);
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write('<h1>Erro interno do servidor</h1>');
                        res.end();
                    });
                }
            }else if (req.url.startsWith('/marca')) {
                const parsedUrl = url.parse(req.url, true);

                const marca = parsedUrl.query.marca;
                const modelo = parsedUrl.query.modelo;

                if (marca != null && modelo == null){
                    axios.get('http://localhost:3000/viaturas?marca='+marca)
                    .then(resp => {
                        const data = resp.data;
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write(pages.gerarPaginaVeiculosMarca(data)); // Passar o array completo
                        res.end(); 
                    })
                    .catch(err => {
                        console.error('Erro ao buscar os clientes:', err.message);
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write('<h1>Erro interno do servidor</h1>');
                        res.end();
                    });
                } else if (marca != null && modelo != null){
                    axios.get('http://localhost:3000/viaturas?marca='+marca+'&modelos='+modelo)
                    .then(resp => {
                        const data = resp.data;
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write(pages.gerarPaginaVeiculosMarcaModelo(data)); // Passar o array completo
                        res.end(); 
                    })
                    .catch(err => {
                        console.error('Erro ao buscar os clientes:', err.message);
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write('<h1>Erro interno do servidor</h1>');
                        res.end();
                    });
                } else {
                    axios.get('http://localhost:3000/viaturas?_sort=marca,modelo')
                    .then(resp => {
                        const marca = resp.data;
                        
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write(pages.gerarPaginaVeiculos(marca));
                        res.end();  
                    })
                    .catch(err => {
                        console.error('Erro ao buscar viaturas:', err.message);
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write('<h1>Erro interno do servidor</h1>');
                        res.end();
                    });
                }
            } else {
                res.write('<h1>404 - Página não encontrada</h1>');
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end();
            }
            break;
        
        default:
            res.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write('<h1>405 - Método não permitido</h1>');
            res.end();
            break;
    }
}).listen(4321);

console.log("Servidor a correr em http://localhost:4321");