const http = require('http');
const axios = require('axios');
const fl = require('fs')
const url = require('url');

const pages = require('./myPages');
const { parse } = require('path');

http.createServer((req, res) => {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + "       " + d)

    switch (req.method) {
        case 'GET':
            if (req.url === '/'){
                Promise.all([ // PERGUNTAR AO PROFESSOR SOBRE AWAIT E SYNC
                    axios.get('http://localhost:3000/alunos'),
                    axios.get('http://localhost:3000/cursos'),
                    axios.get('http://localhost:3000/instrumentos')
                ])
                .then(([alunosData, cursosData, instrumentosData]) => {
                    alunos = alunosData.data,
                    cursos = cursosData.data,
                    instrumentos = instrumentosData.data
        
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.write(pages.gerarPaginaPrincipal(alunos, cursos, instrumentos, d));
                    res.end();
                })
                .catch(err => {
                    console.error('Erro ao buscar os dados:', err.message);
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.write('<h1>Erro interno do servidor</h1>');
                    res.end();
                });
            } else if (req.url === '/alunos') {
                axios.get('http://localhost:3000/alunos')
                    .then(resp => {
                        const alunos = resp.data;
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write(pages.gerarPaginaAlunos(alunos, d));
                        res.end();
                    })
                    .catch(err => {
                        console.error('Erro ao buscar os alunos:', err.message);
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write('<h1>Erro interno do servidor</h1>');
                        res.end();
                    });
            } else if (req.url === '/cursos') {
                axios.get('http://localhost:3000/cursos')
                    .then(resp => {
                        const cursos = resp.data;
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write(pages.gerarPaginaCursos(cursos, d));
                        res.end();
                    })
                    .catch(err => {
                        console.error('Erro ao buscar os cursos:', err.message);
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write('<h1>Erro interno do servidor</h1>');
                        res.end();
                    });
            } else if (req.url === '/instrumentos') {
                axios.get('http://localhost:3000/instrumentos')
                    .then(resp => {
                        const instrumentos = resp.data;
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write(pages.gerarPaginaInstrumentos(instrumentos, d));
                        res.end();
                    })
                    .catch(err => {
                        console.error('Erro ao buscar os instrumentos:', err.message);
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write('<h1>Erro interno do servidor</h1>');
                        res.end();
                    });
            } else if (req.url.startsWith('/alunos')) {
                var id = req.url.split('/')[2];
                axios.get('http://localhost:3000/alunos/'+id)
                    .then(resp => {
                        const data = resp.data;
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write(pages.gerarPaginaIndividual(data, d));
                        res.end(); 
                    })
                    .catch(err => {
                        console.error('Erro ao buscar os clientes:', err.message);
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write('<h1>Erro interno do servidor</h1>');
                        res.end();
                    });
            }else if (req.url.startsWith('/cursos')) {
                var id = req.url.split('/')[2];
                Promise.all([
                    axios.get('http://localhost:3000/cursos/'+id),
                    axios.get('http://localhost:3000/alunos?curso='+id)
                ])
                    .then(([dataCurso, dataAlunos]) => {
                        const data = dataCurso.data;
                        const alunos = dataAlunos.data;
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write(pages.gerarPaginaIndividualCurso(data, alunos, d));
                        res.end(); 
                    })
                    .catch(err => {
                        console.error('Erro ao buscar os clientes:', err.message);
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.write('<h1>Erro interno do servidor ou o curso não existe</h1><a href="/">Voltar</a>');
                        res.end();
                    });
                } else if (req.url.startsWith('/instrumentos')) {
                    var idOuNome = req.url.split('/')[2];
                
                    axios.get('http://localhost:3000/alunos')
                        .then(resp => {
                            let alunosData = resp.data;
                
                            // Primeiro, tenta obter pelo ID
                            return axios.get(`http://localhost:3000/instrumentos/${idOuNome}`)
                                .then(instrResp => ({ instrumento: instrResp.data, alunos: alunosData }))
                                .catch(() => {
                                    // Se falhar, tenta obter pelo nome (#text)
                                    return axios.get(`http://localhost:3000/instrumentos?%23text=${encodeURIComponent(idOuNome)}`)
                                        .then(instrResp => {
                                            let instrumentosData = instrResp.data;
                
                                            if (Array.isArray(instrumentosData) && instrumentosData.length > 0) {
                                                return { instrumento: instrumentosData[0], alunos: alunosData };
                                            } else {
                                                throw new Error("Instrumento não encontrado");
                                            }
                                        });
                                });
                        })
                        .then(({ instrumento, alunos }) => {
                            // Filtrar alunos que tocam esse instrumento
                            let alunosQueTocam = alunos.filter(a => a.instrumento === instrumento["#text"]);
                
                            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.write(pages.gerarPaginaIndividualInstrumento(instrumento, alunosQueTocam, d));
                            res.end();
                        })
                        .catch(err => {
                            console.error('Erro ao buscar o instrumento:', err.message);
                            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.write('<h1>Instrumento não encontrado</h1>');
                            res.end();
                        });
            } else if(req.url.match(/favicon\.ico$/)) {
                fl.readFile("logo.ico", function(erro, dados){
                    if(erro){
                        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end('<p>Erro na leitura do ficheiro: ' + erro + '</p>')
                    } else {
                        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
                        res.end(dados)
                    }
                })
            } else if(req.url.match(/bootstrap\.min\.css$/)) {
                fl.readFile("bootstrap.min.css", function(erro, dados){
                    if(erro){
                        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end('<p>Erro na leitura do ficheiro: ' + erro + '</p>')
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/css'})
                        res.end(dados)
                    }
                })
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write('<h1>404 - Página não encontrada</h1>');
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