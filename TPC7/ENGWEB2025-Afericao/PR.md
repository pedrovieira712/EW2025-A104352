# PR.md - Descrição do Projeto

## 1. Persistência de Dados

Para a persistência de dados, utilizei o MongoDB como banco de dados. O MongoDB foi configurado dentro de um **container Docker** para garantir que a base de dados seja facilmente configurada e acessada. A base de dados foi importada a partir do arquivo `dataset.json` e foi feita a limpeza do arquivo para garantir que todos os campos estivessem corretamente estruturados.

### Passos para Configuração do Banco de Dados:

1. **Configuração do Docker para MongoDB**:
   - Se o container MongoDB não existir, foi executado o seguinte comando para criar e rodar o container:
     ```bash
     docker run -d -p 27017:27017 --name mongoEW -v mongoData2025:/data/db mongoEW
     ```
   - Se o container já existia, foi usado:
     ```bash
     docker start mongoEW
     ```

2. **Importação do Dataset para o MongoDB**:
   - O arquivo `dataset.json` foi importado para a base de dados MongoDB utilizando o seguinte comando dentro do terminal do container:
     ```bash
     mongoimport -d livros -c livros /data/db/dataset.json --jsonArray
     ```

3. **Estrutura do Modelo no MongoDB**:
   - O modelo de dados foi baseado no arquivo `dataset.json`. Após a importação, as informações do livro, como `bookId`, `title`, `author`, `genres`, `characters`, entre outros, foram estruturadas para garantir que o campo `id` (resultante dos numeros iniciais do  `bookId`) fosse tratado como `_id` no MongoDB.

4. **Conexão API com MongoDB**:
   - No código da API, a conexão com o MongoDB foi configurada da seguinte forma:
     ```javascript
     var mongoose = require('mongoose');
     var mongoDB = 'mongodb://localhost:27017/livros';
     mongoose.connect(mongoDB);
     var connection = mongoose.connection;
     connection.on('error', console.error.bind(console, 'Erro na conexão com MongoDB'));
     connection.once('open', () => console.log('Conexão estabelecida com MongoDB'));
     ```

## 2. Configuração da API

Para a API, utilizei o **Express.js**, um framework para Node.js, para criar as rotas necessárias e garantir a comunicação com o MongoDB.

### Passos para Configuração da API:

1. **Gerar o projeto com Express**:
   - Para iniciar o projeto da API, utilizei o comando:
     ```bash
     npx express-generator --view=pug nome-da-api
     ```
   
2. **Configuração das Rotas**:
   - A API foi configurada para responder às rotas especificadas no enunciado:
     - `GET /books`: Retorna todos os livros.
     - `GET /books/:id`: Retorna o livro com o ID especificado.
     - `POST /books`: Adiciona um novo livro.
     - `DELETE /books/:id`: Deleta o livro com o ID especificado.
     - `PUT /books/:id`: Atualiza o livro com o ID especificado.
     - Entre outras consultas específicas para personagens, gêneros e autores.

3. **Testes com Postman**:
   - As rotas foram testadas com **Postman** para garantir que estavam funcionando corretamente, com retorno dos dados desejados, como os títulos dos livros, autores e gêneros.

## 3. Front-End

A aplicação front-end foi implementada utilizando **Express.js** com **Pug** como motor de templates. O front-end faz chamadas para a API de livros, exibe a lista de livros, informações detalhadas de cada livro e a lista de autores.

### Instruções para Executar as Aplicações Desenvolvidas

Para executar a aplicação e garantir que ela funcione corretamente, siga os passos abaixo:

1. **Instalar Dependências**:
   Após clonar o repositório ou obter os arquivos, execute o comando para instalar as dependências tanto na api como na app (Front-End):
   ```bash
   npm i
   ```
2. Executar a API: Para rodar a API no servidor, execute:
    ```bash
    npm start
    ```
4. Executar o Front-End: Para rodar a aplicação front-end, execute:
    ```bash
    npm start
    ```