# Diário Digital

Sistema web para gestão e partilha de conteúdos digitais com suporte para diferentes tipos de ficheiros, categorização e comentários.

**Autores:**
- Pedro Pinto (a104176)
- Marco Brito (a104187) 
- Pedro Vieira (a104352)

## Arquitetura

- **Backend**: API REST em Node.js/Express + MongoDB
- **Frontend**: Aplicação web em Express + Pug templates
- **Base de Dados**: MongoDB com Mongoose ODM


### Setup
```bash
# Clonar repositório
git clone [url]
cd diario-digital

# Backend
cd api
npm install
npm start  # porta 25000

# Frontend  
cd ../app
npm install
npm start  # porta 25001
```

### Configuração
```javascript
// api/app.js - Configurar MongoDB
var mongoDB = 'mongodb://localhost:27017/diario_digital'
```

## Funcionalidades

### Utilizadores
- Registo e autenticação (JWT)
- Perfis com níveis de acesso (normal/admin)
- Gestão de sessões

### Conteúdos
- Criação de itens (foto, documento, texto, misto, zip)
- Categorização hierárquica
- Tags e metadados flexíveis
- Visibilidade pública/privada
- Upload de ficheiros múltiplos

### Comentários
- Sistema de comentários tipificados:
  - **note**: Observações gerais
  - **context**: Informação contextual  
  - **application**: Sugestões de aplicação
  - **correction**: Correções
  - **enhancement**: Melhorias

### SIP (Submission Information Package)
- Upload de pacotes ZIP estruturados
- Validação de manifesto JSON
- Extração e processamento automático
- Criação de itens a partir do manifesto

### Administração
- Dashboard com estatísticas
- Gestão de utilizadores e categorias
- Logs de atividade do sistema
- Exportação de dados

## Modelos de Dados

### User
```javascript
{
  username: String (único),
  email: String (único),
  password: String (hash),
  name: String,
  isAdmin: Boolean,
  createdAt: Date
}
```

### Item
```javascript
{
  title: String,
  description: String,
  type: ['photo', 'document', 'text', 'mixed', 'zip'],
  category: ObjectId,
  tags: [String],
  isPublic: Boolean,
  producer: String,
  submitter: ObjectId,
  files: [ObjectId],
  metadata: Object,
  createdAt: Date
}
```

### Category
```javascript
{
  name: String,
  description: String,
  parent: ObjectId,
  level: Number,
  isActive: Boolean
}
```

### File
```javascript
{
  originalName: String,
  filename: String,
  path: String,
  mimetype: String,
  size: Number,
  itemId: ObjectId
}
```

### Comment
```javascript
{
  itemId: ObjectId,
  userId: ObjectId,
  content: String,
  type: ['note', 'context', 'application', 'correction', 'enhancement'],
  createdAt: Date
}
```

## API Endpoints

### Autenticação
- `POST /user/register` - Registar utilizador
- `POST /user/login` - Autenticar utilizador

### Itens
- `GET /item` - Listar itens (públicos sem auth)
- `GET /item/:id` - Obter item específico
- `POST /item` - Criar item (auth)
- `PUT /item/:id` - Atualizar item (auth)
- `DELETE /item/:id` - Eliminar item (auth)
- `GET /item/category/:id` - Itens por categoria

### Categorias
- `GET /category` - Listar categorias
- `POST /category` - Criar categoria (auth)
- `PUT /category/:id` - Atualizar categoria (auth)
- `DELETE /category/:id` - Eliminar categoria (auth)

### Ficheiros
- `GET /file/:id` - Obter ficheiro
- `GET /file/download/:id` - Download ficheiro
- `DELETE /file/:id` - Eliminar ficheiro (auth)

### Comentários
- `GET /comment/item/:id` - Comentários do item
- `POST /comment` - Criar comentário (auth)
- `DELETE /comment/:id` - Eliminar comentário (auth)

### SIP
- `POST /sip/upload` - Upload pacote SIP (auth)
- `GET /sip/processed` - Listar SIPs processados (auth)

### Logs (Admin)
- `GET /log` - Listar logs
- `GET /log/stats` - Estatísticas
- `GET /log/export` - Exportar logs

## Estrutura de Ficheiros

```
├── api/                    # Backend API
│   ├── controllers/        # Lógica de negócio
│   ├── models/            # Modelos Mongoose
│   ├── routes/            # Definição de rotas
│   ├── middleware/        # Auth, upload, etc.
│   ├── uploads/           # Ficheiros carregados
│   └── app.js             # Configuração principal
│
├── app/                   # Frontend
│   ├── routes/            # Controladores de rotas
│   ├── views/             # Templates Pug
│   ├── public/            # CSS, JS, imagens
│   └── app.js             # Configuração principal
```

## Segurança

- Passwords encriptadas com bcrypt
- Autenticação JWT com expiração
- Middleware de verificação de tokens
- Controlo de acesso por nível de utilizador
- Validação de inputs e sanitização

## Tecnologias

**Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Multer  
**Frontend**: Express, Pug, Bootstrap, jQuery, Chart.js  
**Ferramentas**: Nodemon, Morgan, AdmZip

## Uso

1. Aceder a `http://localhost:25001`
2. Registar conta ou fazer login
3. Criar categorias (se admin)
4. Adicionar itens com ficheiros
5. Organizar com tags e metadados
6. Comentar e partilhar conteúdos
7. Usar painel admin para gestão

## Manifesto SIP

Exemplo de manifesto para pacotes SIP:

```json
{
  "title": "Título do item",
  "description": "Descrição detalhada",
  "type": "mixed",
  "producer": "Nome do produtor",
  "createdAt": "2025-01-01T00:00:00Z",
  "files": [
    {
      "filename": "foto1.jpg",
      "description": "Fotografia principal",
      "type": "image"
    }
  ],
  "metadata": {
    "location": "Porto",
    "event": "Evento especial"
  }
}
```


## Conclusão
O projeto "Diário Digital" constitui uma solução robusta e versátil para a gestão de conteúdos digitais, destacando-se pela sua arquitetura modular, segurança, usabilidade e escalabilidade. Com funcionalidades avançadas como gestão de utilizadores, organização hierárquica de conteúdos, comentários qualificados, processamento automático de pacotes SIP e controlo detalhado de permissões, a aplicação adapta-se a diversos contextos, desde arquivos pessoais a instituições, comunidades, empresas e educação. A interface intuitiva, aliada à interoperabilidade com padrões como SIP, garante uma experiência eficiente e flexível. Para o futuro, estão previstas melhorias como aplicação móvel, integração com armazenamento em nuvem, pesquisa full-text, workflows de aprovação, relatórios analíticos, backups automáticos e sistema de notificações em tempo real.