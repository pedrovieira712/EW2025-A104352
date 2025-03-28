var mongoose = require('mongoose')

var contratoSchema = new mongoose.Schema({
    _id: String,
    nAnuncio: String,
    tipoprocedimento: String,
    objectoContrato: String,
    dataPublicacao: String,
    dataCelebracaoContrato: String,
    precoContratual: Number,
    prazoExecucao: String,
    NIPC_entidade_comunicante: String,
    entidade_comunicante: String,
    fundamentacao: String,
  }, {versionKey: false})
  
  module.exports = mongoose.model('contrato', contratoSchema)