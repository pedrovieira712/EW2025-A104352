import json
from collections import defaultdict

def processar_dataset(caminho_entrada, caminho_saida):
    with open(caminho_entrada, "r", encoding="utf-8") as arquivo:
        dados_originais = json.load(arquivo)

    viaturas_unicas = {}

    for reparacao in dados_originais["reparacoes"]:
        chave_viatura = (
            reparacao['viatura']['marca'],
            reparacao['viatura']['modelo'],
            reparacao['viatura']['matricula']
        )

        if chave_viatura not in viaturas_unicas:
            viaturas_unicas[chave_viatura] = reparacao['viatura']

    novo_dataset = {
        "reparacoes": dados_originais["reparacoes"],
        "viaturas": list(viaturas_unicas.values()),
    }

    with open(caminho_saida, "w", encoding="utf-8") as arquivo:
        json.dump(novo_dataset, arquivo, indent=4, ensure_ascii=False)

    print(f"JSON Criado, Total de reparações: {len(dados_originais['reparacoes'])} e Viaturas únicas: {len(viaturas_unicas)}")

processar_dataset("dataset_reparacoes.json", "dataset_processado.json")
