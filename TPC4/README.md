# TPC4

## Identificação
- **Nome:** Pedro de Seabra Vieira  
- **Número:** A104352  
- **Data:** 18/03/2025  
- **Foto:**  
  ![Foto](../assets/img/FotoPerfil.png)

## Problema
O objetivo deste trabalho é desenvolver uma aplicação web para gerir e visualizar informações sobre filmes. A aplicação permite visualizar, editar e eliminar registos de filmes.

## Funcionalidades
- Apresentação de uma lista de filmes registados.
- Visualização dos detalhes de cada filme.
- Edição de informação dos filmes.
- Remoção de filmes da base de dados.
- Filtro de filmes por ator.

## Endpoints
- **GET /**: Apresenta a página principal com a listagem de filmes.
- **GET /filmes**: Retorna a listagem de todos os filmes disponíveis.
- **GET /filmes/autor/:nome**: Exibe os filmes relacionados a um determinado ator.
- **GET /filmes/edit/:id**: Apresenta o formulário para edição de um filme específico.
- **POST /filmes/update/:id**: Atualiza os dados de um filme específico.
- **GET /filmes/delete/:id**: Remove um filme da base de dados.


## Tecnologias Utilizadas
- **Node.js** e **Express** para o backend.
- **Pug** como motor de templates para renderização das páginas.
- **Bootstrap** para estilização responsiva.
- **JSON-Server** para simular uma API de filmes.

## Conclusão
Este trabalho permitiu aprofundar conhecimentos sobre desenvolvimento web utilizando Node.js, Express e Pug, além de estilização responsiva com Bootstrap. A aplicação criada facilita a gestão e visualização de informações sobre filmes de forma eficiente e organizada.

