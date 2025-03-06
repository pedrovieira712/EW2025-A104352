#!/usr/bin/env python3
import csv
import json
import sys

# Verificar se os argumentos foram fornecidos corretamente
if len(sys.argv) != 3:
    print("Uso: python3 main.py <arquivo_csv> <arquivo_json>")
    sys.exit(1)

# Obter os nomes dos arquivos a partir dos argumentos
csv_file = sys.argv[1]
json_file = sys.argv[2]

try:
    # Ler o arquivo CSV e converter para uma lista
    with open(csv_file, 'r', encoding='utf-8') as f:
        csv_reader = csv.DictReader(f, delimiter=';')
        data = [row for row in csv_reader]
    
    # Criar a estrutura com a chave "alunos"
    structured_data = {"alunos": data}
    
    # Converter para JSON
    json_data = json.dumps(structured_data, indent=4, ensure_ascii=False)

    # Salvar o resultado em um arquivo JSON
    with open(json_file, 'w', encoding='utf-8') as f:
        f.write(json_data)

    print(f"Conversão concluída! O arquivo JSON foi salvo como '{json_file}'.")

except FileNotFoundError:
    print(f"Erro: O arquivo '{csv_file}' não foi encontrado.")
    sys.exit(1)
except Exception as e:
    print(f"Erro inesperado: {e}")
    sys.exit(1)