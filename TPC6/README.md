# TPC6

## Identificação
- **Nome:** Pedro de Seabra Vieira  
- **Número:** A104352  
- **Data:** 27/03/2025  
- **Foto:**  
  ![Foto](../assets/img/FotoPerfil.png)

## Problema
Este projeto cria um sistema de gestão de contratos públicos, facilitando a consulta e análise de contratos do setor público. O objetivo é oferecer uma interface intuitiva e eficaz para explorar informações sobre os contratos, como as entidades envolvidas, valores, datas e tipos de procedimentos.

O sistema é composto por duas componentes principais:
- **Interface Web**: Criada com Express e Pug, permitindo a interação do utilizador por meio de uma interface gráfica.
- **API de Dados**: Implementada em Node.js com Mongoose, responsável por gerenciar as operações com a base de dados e a lógica do sistema.

### Interface Web (Express + Pug)
- **Lista de Contratos**: Permite visualizar todos os contratos registados no sistema.
- **Detalhes do Contrato**: Exibe informações detalhadas sobre um contrato específico.
- **Contratos por Entidade**: Lista todos os contratos associados a uma entidade específica (por NIPC).

### API de Dados (Node.js + Mongoose)
- **Operações CRUD**: 
  - `GET /contratos`: Lista todos os contratos.
  - `GET /contratos/:id`: Obtém os detalhes de um contrato específico.
  - `POST /contratos`: Adiciona um novo contrato.
  - `PUT /contratos/:id`: Atualiza as informações de um contrato existente.
  - `DELETE /contratos/:id`: Remove um contrato do sistema.
- **Consultas Específicas**:
  - `GET /contratos?entidade=[nome]`: Filtra contratos por entidade.
  - `GET /contratos?tipo=[tipo]`: Filtra contratos por tipo de procedimento.
  - `GET /contratos/entidades`: Lista todas as entidades.
  - `GET /contratos/entidades/:nipc`: Lista contratos por NIPC de entidade.
  - `GET /contratos/tipos`: Lista todos os tipos de procedimento.