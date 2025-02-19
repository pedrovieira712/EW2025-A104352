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
              