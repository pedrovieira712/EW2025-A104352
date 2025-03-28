# TPC5

## Identificação
- **Nome:** Pedro de Seabra Vieira  
- **Número:** A104352  
- **Data:** 20/03/2025  
- **Foto:**  
  ![Foto](../assets/img/FotoPerfil.png)


## Problema

Este projeto desenvolve um sistema de gestão de alunos, permitindo a consulta, adição, edição e remoção de dados relacionados aos alunos. O objetivo é oferecer uma interface simples e eficiente para administrar as informações dos alunos, como nome, número de identificação, GitHub e a realização de trabalhos de casa (TPCs).

O sistema é composto por duas partes principais:
- **Interface Web**: Criado com Express e Pug, possibilitando a interação do utilizador por meio de uma interface gráfica.
- **API de Dados**: Criado em **Node.js** com uso do **Mongoose**, que controla toda informação de base de dados.

## Funcionalidades

### Interface Web (Express + Pug)
- **Lista de Alunos**: Permite visualizar todos os alunos registados no sistema.
- **Detalhes do Aluno**: Exibe informações detalhadas sobre um aluno específico, incluindo o estado dos TPCs.
- **Adicionar Aluno**: Permite adicionar um novo aluno ao sistema.
- **Editar Aluno**: Permite editar as informações de um aluno existente.
- **Remover Aluno**: Permite eliminar um aluno do sistema.

### API de Dados (Node.js + Mongoose)
- **Operações CRUD**: 
  - `GET /alunos`: Lista todos os alunos.
  - `GET /alunos/:id`: Obtém os detalhes de um aluno específico.
  - `POST /alunos`: Adiciona um novo aluno.
  - `PUT /alunos/:id`: Atualiza as informações de um aluno existente.
  - `DELETE /alunos/:id`: Remove um aluno do sistema.
- **Gestão de TPCs**:
  - `PUT /alunos/:id/tpc/:idTpc`: Inverte o estado de um TPC específico (concluído/não concluído).