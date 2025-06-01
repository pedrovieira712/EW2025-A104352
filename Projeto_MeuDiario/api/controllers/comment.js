var Comment = require("../models/comment")
var Item = require("../models/item")
var Log = require("../controllers/log")

// Listar todos os comentários
module.exports.list = () => {
  return Comment
    .find()
    .populate("userId", "username name")
    .populate("itemId", "title")
    .sort({ createdAt: -1 })
    .exec()
}

// Obter um comentário
module.exports.lookUp = (id) => {
  return Comment.findById(id)
    .populate("userId", "username name")
    .populate("itemId", "title")
    .populate("parentComment")
    .exec()
}

// Criar novo comentário
module.exports.create = async (commentData, ip) => {
  try {
    // Verificar se o item existe e se o usuário pode comentar
    const item = await Item.findById(commentData.itemId).populate("submitter")
    if (!item) {
      throw new Error("Item não encontrado")
    }

    const canComment = item.isPublic || commentData.userId === item.submitter._id.toString() || commentData.isAdmin

    if (!canComment) {
      throw new Error("Não tem permissão para comentar neste item privado")
    }

    const comment = new Comment(commentData)
    const savedComment = await comment.save()

    // Registar log
    await Log.registerActivity("create", commentData.itemId, commentData.userId, ip, {
      commentId: savedComment._id,
      commentType: commentData.type || "note",
    })

    return savedComment
  } catch (error) {
    console.error("Erro ao criar comentário:", error)
    throw error
  }
}


// Eliminar comentário
module.exports.delete = async (id, userId, ip, isAdmin = false) => {
  try {
    // Verificar se é o autor do comentário ou admin
    const comment = await Comment.findById(id)
    if (!comment) {
      throw new Error("Comentário não encontrado")
    }

    if (comment.userId.toString() !== userId && !isAdmin) {
      throw new Error("Não autorizado a eliminar este comentário")
    }

    // Eliminar
    const deletedComment = await Comment.findByIdAndDelete(id)

    // Registar log
    await Log.registerActivity("delete", comment.itemId, userId, ip, {
      commentId: id,
      deletedByAdmin: isAdmin,
    })

    return deletedComment
  } catch (error) {
    console.error("Erro ao eliminar comentário:", error)
    throw error
  }
}

// Listar comentários por item (com controlo de visibilidade)
module.exports.listByItem = async (itemId, userId = null, isAdmin = false) => {
  try {
    // Verificar se o item existe e se o usuário pode ver os comentários
    const item = await Item.findById(itemId).populate("submitter")
    if (!item) {
      throw new Error("Item não encontrado")
    }

    const canViewComments = item.isPublic || (userId && userId === item.submitter._id.toString()) || isAdmin

    if (!canViewComments) {
      return [] // Retorna array vazio se não pode ver
    }

    return Comment.find({ itemId: itemId })
      .populate("userId", "username name")
      .sort({ createdAt: 1 }) // Ordem cronológica
      .exec()
  } catch (error) {
    console.error("Erro ao listar comentários:", error)
    throw error
  }
}

// Listar comentários por utilizador
module.exports.listByUser = (userId) => {
  return Comment
    .find({ userId: userId })
    .populate("itemId", "title")
    .sort({ createdAt: -1 })
    .exec()
}

// Listar comentários por tipo
module.exports.listByType = (type) => {
  return Comment.find({ type: type })
    .populate("userId", "username name")
    .populate("itemId", "title")
    .sort({ createdAt: -1 })
    .exec()
}

// Listar respostas a um comentário
module.exports.listReplies = (commentId) => {
  return Comment
    .find({ parentComment: commentId })
    .populate("userId", "username name")
    .sort({ createdAt: 1 })
    .exec()
}
