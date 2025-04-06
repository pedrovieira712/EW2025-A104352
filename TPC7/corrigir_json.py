import json
import ast

def corrigir_json(data):
    # Converter campos que são listas mas estão como strings
    data['genres'] = ast.literal_eval(data['genres'])
    data['characters'] = ast.literal_eval(data['characters'])
    data['awards'] = ast.literal_eval(data['awards'])
    data['ratingsByStars'] = ast.literal_eval(data['ratingsByStars'])
    data['setting'] = ast.literal_eval(data['setting'])

    # Corrigir o campo 'author' para ser uma lista
    if isinstance(data['author'], str):
        # Dividir a string por vírgulas e remover espaços extras
        data['author'] = [author.strip() for author in data['author'].split(',')]

    # Corrigir o campo 'rating' para float
    data['rating'] = float(data['rating']) if data.get('rating') else 0.0

    # Corrigir campos numéricos para os tipos corretos
    if 'numRatings' in data:
        data['numRatings'] = int(data['numRatings']) if data['numRatings'].isdigit() else 0

    if 'price' in data:
        data['price'] = float(data['price']) if isinstance(data['price'], str) and data['price'].replace('.', '', 1).isdigit() else 0.0

    # Limpar a descrição
    data['description'] = data['description'].strip()

    # Adicionar o campo '_id' extraindo a parte antes do ponto ('.') ou hífen ('-')
    book_id = data.get('bookId', '')
    if book_id:
        # Usar split para pegar a parte antes do primeiro separador (ponto ou hífen)
        data['_id'] = int(book_id.split('.')[0] if '.' in book_id else book_id.split('-')[0])

    return data

# Carregar o arquivo JSON
with open('dataset.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Corrigir os dados do JSON
dados_corrigidos = [corrigir_json(item) for item in data]

# Salvar os dados corrigidos em um novo arquivo
with open('dataset_corrigido.json', 'w', encoding='utf-8') as file:
    json.dump(dados_corrigidos, file, indent=4)

print("O arquivo foi corrigido e salvo como 'dataset_corrigido.json'.")
