# TPC3

## Identificação
- **Nome:** Pedro de Seabra Vieira
- **Número:** A104352
- **Data:** 06/03/2025
- **Foto:** 
  ![Foto](../assets/img/FotoPerfil.png)

## Problema
O objetivo deste trabalho (TPC3) é desenvolver uma aplicação web simples para gerenciar uma lista de alunos, permitindo visualizar, adicionar, editar e excluir informações de alunos a partir de um arquivo CSV. A aplicação deve converter os dados de um arquivo CSV para JSON, estruturá-los sob a chave `"alunos"` e servi-los em uma interface web com suporte a recursos estáticos (CSS, ícones e imagens) e operações CRUD (Create, Read, Update, Delete).

## Solução Implementada
A solução consiste em dois componentes principais:
1. **Conversor CSV para JSON**:
   - Um script Python (`main.py`) que lê um arquivo CSV com informações de alunos (id, nome e link do Git) e converte para um arquivo JSON com a estrutura `{"alunos": [...]}`.
   - O script aceita argumentos via linha de comando: o caminho do arquivo CSV de entrada e o arquivo JSON de saída.

2. **Servidor Web em Node.js**:
   - Um servidor HTTP em Node.js (`alunos_server.js`) que utiliza o JSON gerado para fornecer uma interface web.
   - Funcionalidades:
     - Listagem de todos os alunos com links para detalhes, edição e exclusão.
     - Visualização de detalhes de um aluno específico.
     - Formulário para registro de novos alunos.
     - Formulário para edição de dados existentes.
     - Exclusão de alunos via requisições HTTP.
   - Suporte a recursos estáticos (CSS, favicon, imagens) servido pelo módulo `static.js`.
   - Templates HTML gerados dinamicamente pelo módulo `templates.js`.

## Funcionalidades

- **Lista de Alunos**: Permite visualizar todos os alunos registados no sistema, com informações básicas como nome, ID e link do GitHub.
- **Detalhes do Aluno**: Exibe informações detalhadas sobre um aluno específico, incluindo os TPCs concluídos.
- **Adicionar Aluno**: Permite adicionar um novo aluno ao sistema, fornecendo o nome, ID, link do GitHub e os TPCs concluídos.
- **Editar Aluno**: Permite editar as informações de um aluno já existente.
- **Remover Aluno**: Permite eliminar um aluno do sistema.

## Endpoints

- **GET /**: Página inicial (Landing page).
- **GET /alunos**: Lista de alunos registados.
- **GET /alunos/{id}**: Detalhes de um aluno específico, identificado pelo ID.
- **GET /alunos/registo**: Formulário para adicionar um novo aluno.
- **POST /alunos/registo**: Submissão do formulário para adicionar um novo aluno.
- **GET /alunos/edit/{id}**: Formulário para editar as informações de um aluno existente.
- **POST /alunos/edit/{id}**: Submissão do formulário para editar as informações de um aluno com o método post.
- **PUT /alunos/edit/{id}**: Submissão do formulário para editar as informações de um aluno com o método put.
- **GET /alunos/delete/{id}**: Remove um aluno do sistema com o método get.
- **DELETE /alunos/delete/{id}**: Remove um aluno do sistema com o método delete.