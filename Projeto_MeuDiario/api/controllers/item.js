var Item = require("../models/item")

// Modificar a função list para suportar filtros mais específicos
// Substituir a função list existente por:

// Listar todos (com filtros avançados)
module.exports.list = (showAll = false, showPrivate = false, submitterId = null) => {
  var filter = {}

  if (!showAll) {
    filter.isPublic = true
  } else if (showPrivate) {
    filter.isPublic = false
  }

  if (submitterId) {
    filter.submitter = submitterId
  }

  return Item.find(filter)
    .populate("category", "name")
    .populate("submitter", "username name")
    .populate("files")
    .sort({ createdAt: -1 })
    .exec()
}

// Obter um item
module.exports.lookUp = (id) => {
  return Item.findById(id)
    .populate("category", "name description")
    .populate("submitter", "username name")
    .populate("files")
    .exec()
}

// Criar novo item
module.exports.create = (itemData) => {
  const item = new Item(itemData)
  return item.save()
}

// Atualizar item
module.exports.update = (id, itemData) => {
  return Item.findByIdAndUpdate(id, itemData, { new: true })
    .populate("category", "name")
    .populate("submitter", "username name")
    .exec()
}

// Eliminar item
module.exports.delete = (id) => {
  return Item.findByIdAndDelete(id)
}

// Listar por categoria
module.exports.listByCategory = (categoryId) => {
  return Item.find({ category: categoryId, isPublic: true })
    .populate("category", "name")
    .populate("submitter", "username name")
    .sort({ createdAt: -1 })
    .exec()
}

// Listar por tipo
module.exports.listByType = (type) => {
  return Item.find({ type: type, isPublic: true })
    .populate("category", "name")
    .populate("submitter", "username name")
    .sort({ createdAt: -1 })
    .exec()
}
