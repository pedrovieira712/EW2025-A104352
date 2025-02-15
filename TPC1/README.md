# TPC1 - Serviço em nodejs de Oficina de Reparações

## Identificação
- **Nome:** Pedro de Seabra Vieira
- **Número:** A104352
- **Data:** 15/02/2024
- **Foto:** 
  ![Foto](/assets/img/FotoPerfil.png)

## Problema
Foi proposto desenvolver um serviço em Node.js que:
1. Consome uma API de dados servida pelo json-server que contém todas informações de uma oficina de reparações;
2. Crie páginas web dinâmicas baseadas nesses dados;
3. Permite navegação e consulta das informações de reparações, clientes e veículos

## Solução Implementada

### Estrutura do Projeto
- `server.js`: Servidor principal em Node.js
- `pages.js`: Módulo para geração das páginas HTML
- `parserJSON.py`: Script Python para processamento do dataset
- `dataset_reparacoes.json`: Dataset original
- `dataset_processado.json`: Dataset processado pelo parser

## Como Executar

1. Processar o dataset:
```bash
python3 parserJSON.py
```

2. Iniciar o JSON Server (na porta 3000):
```bash
json-server --watch dataset_processado.json --port 3000
```

3. Iniciar o servidor Node.js:
```bash
node server.js
```

4. Acessar a aplicação em:
```
http://localhost:4321
```

## Decisões de Implementação
### Processamento de Dados
- Utilização de Python para processar o dataset original
- Separação de entidades (reparações e viaturas)
- Eliminação de dados duplicados

### Paginação
- Implementação de paginação no servidor na página reparações onde apresenta todos clientes

### Tratamento de Erros
- Try-catch para requisições
- Mensagens de erro apropriadas
- Status HTTP adequados
