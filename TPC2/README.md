# TPC2 - Escola de Música

## Identificação
- **Nome:** Pedro de Seabra Vieira
- **Número:** A104352
- **Data:** 19/02/2025
- **Foto:**  
  ![Foto](/assets/img/FotoPerfil.png)

---

## Problema
O objetivo deste trabalho é desenvolver um serviço em Node.js que consuma a API servida pelo **json-server** da Escola de Música e disponibilize um website com as seguintes funcionalidades:

- **Página Principal:** Listar alunos, cursos e instrumentos.
- **Página de Alunos:** Apresentar uma tabela com informações dos alunos. Ao clicar numa linha, redireciona para a página individual do aluno.
- **Página de Cursos:** Apresentar uma tabela com os cursos disponíveis. Ao clicar num curso, redireciona para a página do curso, que inclui a lista de alunos inscritos.
- **Página de Instrumentos:** Apresentar uma tabela com os instrumentos. Ao clicar num instrumento, redireciona para a página do instrumento, que inclui a lista de alunos que o utilizam.

---

## Como Executar
### **Iniciar o JSON Server** (na porta 3000):
```bash
json-server --watch db.json --port 3000
```

### **Iniciar o servidor Node.js**
```bash
node server.js
```

### **Aceder à aplicação**
```
http://localhost:4321
```

---

## Decisões de Implementação
- **Uso de `Promise.all`**: Para otimizar pedidos simultâneos à API, em vez do uso de await e sync.
- **Busca de instrumentos por ID e Nome**: Como os alunos armazenam o nome do instrumento e não o ID, foi necessário garantir que `/instrumentos/id` e `/instrumentos/nome` levassem para a mesma página.
  
---

## Ficheiros Principais

### `server.js`
- Servidor HTTP que processa pedidos GET.
- Faz requisições à API (`json-server`).
- Retorna páginas HTML geradas dinamicamente.

### `myPages.js`
- Contém funções que geram páginas HTML.
- Utiliza Bootstrap para formatação visual.
- Inclui tabelas clicáveis para alunos, cursos e instrumentos.
