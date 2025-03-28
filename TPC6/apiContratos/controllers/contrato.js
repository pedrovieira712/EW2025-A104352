var Contrato = require('../models/contrato')

module.exports.getAllContracts = () => {
    return Contrato
        .find()
        .exec()
}

module.exports.getContractById = id => {
    return Contrato
        .findById(id)
        .exec()
}

module.exports.getAllContractsFilterByEntidade = entidade => {
    return Contrato
        .find({entidade_comunicante : entidade})
        .exec()
}

module.exports.getContratosByNIPC = nipc => {
    return Contrato
        .find({NIPC_entidade_comunicante : nipc})
        .exec()
}

module.exports.getAllContractsFilterByTipo = tipo => {
    return Contrato
        .find({tipoprocedimento : tipo})
        .exec()
}

module.exports.getAllContractsFilterByEntidadeAndTipo = (entidade, tipo) => {
    return Contrato
        .find({entidade_comunicante : entidade, tipoprocedimento : tipo})
        .exec()
}


module.exports.getEntidades = () => {
    return Contrato
        .distinct('entidade_comunicante')
        .sort({entidade_comunicante : 1})
        .exec()
}

module.exports.getTipos = () => {
    return Contrato
        .distinct('tipoprocedimento')
        .sort({tipoprocedimento : 1})
        .exec()
}

module.exports.insert = contr => {
    var newContract = new Contrato(contr)
    return newContract.save()
}

module.exports.update = (id, contr) => {
    return Contrato
        .findByIdAndUpdate(id, contr, {new : true})
        .exec()
}


module.exports.delete = id => {
    return Contrato
        .findByIdAndDelete(id, {new : true})
        .exec()

    // Aluno.findById(id).deleteOne().exec()
}