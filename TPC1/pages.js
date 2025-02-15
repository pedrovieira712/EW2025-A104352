const fs = require('fs');
const path = require('path');

// Função para gerar HTML base com cabeçalho e rodapé
function gerarHtmlBase(titulo, conteudo) {
    return `
<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${titulo}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container-fluid">
        <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Oficina de Reparações</a>
                <div class="navbar-nav">
                    <a class="nav-link" href="/reparacoes">Reparações</a>
                    <a class="nav-link" href="/marcas">Marcas</a>
                </div>
            </div>
        </nav>

        ${conteudo}
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
    `;
}

// Função que retorna o HTML da página principal
module.exports.gerarPaginaPrincipal = function() {
    // Conteúdo da página principal com botões estilizados
    const conteudo = `
    <div class="d-flex justify-content-center align-items-center ">
        <div class="card text-center p-4 shadow-lg">
            <div class="card-body">
                <h2 class="card-title mb-4">Bem-vindo à Oficina de Reparações</h2>
                <div class="d-grid gap-3 mt-4">
                    <a href="/reparacoes" class="btn btn-primary btn-lg">Ver Reparações</a>
                    <a href="/marca" class="btn btn-secondary btn-lg">Ver Marcas e Modelos</a>
                </div>
                <hr class="my-4">
                
                <h4 class="mb-3">Pesquisa por Data</h4>
                <form action="/reparacoes" class="d-flex justify-content-center">
                    <input type="date" name="data" class="form-control w-50" required>
                    <button type="submit" class="btn btn-success ms-2">Pesquisar</button>
                </form>
            </div>
        </div>
    </div>
    `;

    // Retornar HTML completo
    return gerarHtmlBase('Oficina de Reparações', conteudo);
};


module.exports.gerarPaginaReparacoes = function (reparacoes, paginaAtual, totalPaginas) {
    // Dividir a lista em 3 colunas automaticamente
    const colunas = [[], [], []];
    reparacoes.forEach((element, index) => {
        colunas[index % 3].push(element);
    });

    // Gerar lista de reparações distribuída em 3 colunas
    const conteudo = `
    <div class="row">
        <div class="col-md-10 offset-md-1">
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Lista de Reparações</h2>
                </div>
                <div class="card-body">
                    <div class="row">
                        ${colunas.map(coluna => `
                            <div class="col-md-4">
                                <ul class="list-group">
                                    ${coluna.map(element => `
                                        <li class="list-group-item">
                                            <a href='/reparacoes?nif=${element.nif}' class="text-decoration-none">
                                                ${element.nome} (NIF: ${element.nif})
                                            </a>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    ${paginaAtual > 1 ? `<a href="/reparacoes?pagina=${paginaAtual - 1}" class="btn btn-secondary">Anterior</a>` : '<span></span>'}
                    <span class="text-muted">Página ${paginaAtual} de ${totalPaginas}</span>
                    ${paginaAtual < totalPaginas ? `<a href="/reparacoes?pagina=${paginaAtual + 1}" class="btn btn-primary">Próximo</a>` : '<span></span>'}
                </div>
            </div>
        </div>
    </div>
    `;

    // Retornar HTML completo
    return gerarHtmlBase('Clientes', conteudo);
};

module.exports.gerarPaginaVeiculos = function(marcas) {
    // Criar um conjunto para armazenar marcas únicas
    const marcasUnicas = [...new Set(marcas.map(element => element.marca))];

    // Gerar o conteúdo das marcas organizadas em 3 colunas
    const conteudo = `
    <div class="container mt-4">
        <h2 class="text-center">Lista de Marcas</h2>
        <div class="row row-cols-1 row-cols-md-3 g-4">
            ${marcasUnicas.map(marca => `
                <div class="col">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <h5 class="card-title">${marca}</h5>
                            <a href="/marca?marca=${encodeURIComponent(marca)}" class="btn btn-primary">Ver Modelos</a>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
    `;

    return gerarHtmlBase('Marcas', conteudo);
};

module.exports.gerarPaginaVeiculosMarca = function(viaturas) {
    // Criar um conjunto de modelos únicos para a marca selecionada
    const modelosUnicos = [...new Set(viaturas.map(element => element.modelo))];

    // Gerar o conteúdo dos modelos organizados em 3 col