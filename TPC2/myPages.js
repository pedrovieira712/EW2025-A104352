function gerarHtmlBase(titulo, conteudo, data) {
    return `
<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${titulo}</title>
    <link href="/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container-fluid">
        <nav class="navbar navbar-expand-xl navbar-light bg-light mb-4">
            <div class="container">
                <a class="navbar-brand" href="/">Escola de Música</a>
                <div class="navbar-nav">
                    <a class="nav-link" href="/alunos">Alunos</a>
                    <a class="nav-link" href="/cursos">Cursos</a>
                    <a class="nav-link" href="/instrumentos">Instrumentos</a>
                </div>
            </div>
        </nav>

        ${conteudo}
    </div>

    <footer class="bg-light py-3 my-4">
        <p class="text-center mb-0">Generated in EngWeb2025 ${data}</p>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
    `;
}

export function gerarPaginaPrincipal(alunos, cursos, instrumentos, d) {
    const content = `
    <div class="container">
        <div class="row">
            <!-- Coluna de Alunos -->
            <div class="col-md-4">
                <h2 class="text-center">Alunos</h2>
                <div class="list-group" style="max-height: 75vh; overflow-y: auto; border: 1px solid #ddd;">
                    ${alunos.map(aluno => `
                        <a href="/alunos/${aluno.id}" class="list-group-item">
                            ${aluno.nome} (${aluno.curso})
                        </a>
                    `).join('')}
                </div>
            </div>

            <!-- Coluna de Cursos -->
            <div class="col-md-4">
                <h2 class="text-center">Cursos</h2>
                <div class="list-group" style="max-height: 75vh; overflow-y: auto; border: 1px solid #ddd;">
                    ${cursos.map(curso => `
                        <a href="/cursos/${curso.id}" class="list-group-item">
                            ${curso.designacao} (${curso.instrumento["#text"]})
                        </a>
                    `).join('')}
                </div>
            </div>

            <!-- Coluna de Instrumentos -->
            <div class="col-md-4">
                <h2 class="text-center">Instrumentos</h2>
                <div class="list-group" style="max-height: 75vh; overflow-y: auto; border: 1px solid #ddd;">
                    ${instrumentos.map(instrumento => `
                        <a href="/instrumentos/${instrumento.id}" class="list-group-item">
                            ${instrumento["#text"]}
                        </a>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>
    `;
    return gerarHtmlBase("Página Principal", content, d);
}


export function gerarPaginaIndividual(aluno, d) {
    const content = `
    <div class="container">
        <h1 class="text-center my-4">${aluno.nome}</h1>
        
        <table class="table table-bordered table-striped table-hover">
            <tbody>
                <tr>
                    <th>ID</th>
                    <td>${aluno.id}</td>
                </tr>
                <tr>
                    <th>Nome</th>
                    <td>${aluno.nome}</td>
                </tr>
                <tr>
                    <th>Data de Nascimento</th>
                    <td>${aluno.dataNasc}</td>
                </tr>
                <tr>
                    <th>Curso</th>
                    <td><a href="/cursos/${aluno.curso}">${aluno.curso}</a></td>
                </tr>
                <tr>
                    <th>Ano do Curso</th>
                    <td>${aluno.anoCurso}º Ano</td>
                </tr>
                <tr>
                    <th>Instrumento</th>
                    <td><a href="/instrumentos/${aluno.instrumento}">${aluno.instrumento}</a></td>
                </tr>
            </tbody>
        </table>

        <div class="text-center mt-4">
            <a href="/" class="btn btn-primary">Voltar</a>
        </div>
    </div>
    `;
    
    return gerarHtmlBase(`Aluno ${aluno.nome}`, content, d);
}


export function gerarPaginaIndividualCurso(curso, alunos, d) {
    const alunosList = alunos.length > 0 ? `
    <table class="table table-bordered table-striped table-hover">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
            </tr>
        </thead>
        <tbody>
            ${alunos.map(aluno => `
                <tr onclick="window.location.href='/alunos/${aluno.id}'" style="cursor: pointer;">
                    <td>${aluno.id}</td>
                    <td>${aluno.nome}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
` : '<p>Nenhum aluno utiliza este instrumento.</p>';

    const content = `
    <div class="container">
        <h1 class="text-center my-4">${curso.designacao}</h1>

        <table class="table table-bordered table-striped">
            <tbody>
                <tr>
                    <th>ID</th>
                    <td>${curso.id}</td>
                </tr>
                <tr>
                    <th>Designação</th>
                    <td>${curso.designacao}</td>
                </tr>
                <tr>
                    <th>Duração</th>
                    <td>${curso.duracao} anos</td>
                </tr>
                <tr>
                    <th>Instrumento</th>
                    <td>
                        <a href="/instrumentos/${curso.instrumento.id}">${curso.instrumento["#text"]}</a>
                    </td>
                </tr>
            </tbody>
        </table>

        <h2 class="mt-4">Alunos Inscritos</h2>
        <div class="list-group">
             ${alunosList}
        </div>

        <div class="text-center mt-4">
            <a href="/" class="btn btn-primary">Voltar</a>
        </div>
    </div>
    `;
    
    return gerarHtmlBase(`Curso ${curso.designacao}`, content, d);
}

export function gerarPaginaIndividualInstrumento(instrumento, alunos, d) {
    const alunosList = alunos.length > 0 ? `
        <table class="table table-bordered table-striped table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                </tr>
            </thead>
            <tbody>
                ${alunos.map(aluno => `
                    <tr onclick="window.location.href='/alunos/${aluno.id}'" style="cursor: pointer;">
                        <td>${aluno.id}</td>
                        <td>${aluno.nome}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    ` : '<p>Nenhum aluno utiliza este instrumento.</p>';

    const content = `
    <div class="container">
        <h1 class="text-center my-4">Instrumento: ${instrumento["#text"]}</h1>

        <table class="table table-bordered table-striped">
            <tbody>
                <tr>
                    <th>ID</th>
                    <td>${instrumento.id}</td>
                </tr>
                <tr>
                    <th>Nome</th>
                    <td>${instrumento["#text"]}</td>
                </tr>
            </tbody>
        </table>

        <h2 class="mt-4">Alunos que utilizam este instrumento</h2>
        ${alunosList}

        <div class="text-center mt-4">
            <a href="/" class="btn btn-primary">Voltar</a>
        </div>
    </div>
    `;
    
    return gerarHtmlBase(`Instrumento ${instrumento["#text"]}`, content, d);
}


export function gerarPaginaAlunos(alunos, d) {
    const content = `
    <div class="container">
        <h1 class="text-center my-4">Lista de Alunos</h1>
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Data de Nascimento</th>
                    <th>Curso</th>
                    <th>Ano do Curso</th>
                    <th>Instrumento</th>
                </tr>
            </thead>
            <tbody>
                ${alunos.map(aluno => `
                    <tr onclick="window.location.href='/alunos/${aluno.id}'" style="cursor: pointer;">
                        <td>${aluno.id}</td>
                        <td>${aluno.nome}</td>
                        <td>${aluno.dataNasc}</td>
                        <td><a href="/cursos/${aluno.curso}">${aluno.curso}</a></td>
                        <td>${aluno.anoCurso}º Ano</td>
                        <td><a href="/instrumentos/${aluno.instrumento}">${aluno.instrumento}</a></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="text-center mt-4">
            <a href="/" class="btn btn-primary">Voltar</a>
        </div>
    </div>
    `;
    return gerarHtmlBase("Lista de Alunos", content, d);
}

export function gerarPaginaCursos(cursos, d) {
    const content = `
    <div class="container">
        <h1 class="text-center my-4">Lista de Cursos</h1>
        <table class="table table-bordered table-striped table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Designação</th>
                    <th>Duração</th>
                    <th>Instrumento</th>
                </tr>
            </thead>
            <tbody>
                ${cursos.map(curso => `
                    <tr onclick="window.location.href='/cursos/${curso.id}'" style="cursor: pointer;">
                        <td>${curso.id}</td>
                        <td>${curso.designacao}</td>
                        <td>${curso.duracao} anos</td>
                        <td><a href="/instrumentos/${curso.instrumento.id}">${curso.instrumento["#text"]}</a></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="text-center mt-4">
            <a href="/" class="btn btn-primary">Voltar</a>
        </div>
    </div>
    `;
    return gerarHtmlBase("Lista de Cursos", content, d);
}

export function gerarPaginaInstrumentos(instrumentos, d) {
    const content = `
    <div class="container">
        <h1 class="text-center my-4">Lista de Instrumentos</h1>
        <table class="table table-bordered table-striped table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                </tr>
            </thead>
            <tbody>
                ${instrumentos.map(instrumento => `
                    <tr onclick="window.location.href='/instrumentos/${instrumento.id}'" style="cursor: pointer;">
                        <td>${instrumento.id}</td>
                        <td>${instrumento["#text"]}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="text-center mt-4">
            <a href="/" class="btn btn-primary">Voltar</a>
        </div>
    </div>
    `;
    return gerarHtmlBase("Lista de Instrumentos", content, d);
}