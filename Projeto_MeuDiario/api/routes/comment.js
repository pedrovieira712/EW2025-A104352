var express = require("express")
var router = express.Router()

var Comment = require("../controllers/comment")
var auth = require("../middleware/auth")

// GET /comments - listar todos (admin)
router.get("/", auth, (req, res) => {
  if (req.user && req.user.isAdmin) {
    Comment.list()
      .then((data) => {res.status(200).jsonp(data)})
      .catch((error) => res.status(500).jsonp(error))
  } else {
    res.status(403).jsonp({ error: "Acesso restrito a administradores" })
  }
})

// GET /comments/:_id - obter um comentário
router.get("/:_id", (req, res) => {
  Comment.lookUp(req.params._id)
    .then((data) => res.status(200).jsonp(data))
    .catch((error) => res.status(500).jsonp(error))
})

// POST /comments - criar novo comentário (autenticado)
router.post("/", auth, (req, res) => {
  if (req.user) {
    // Adicionar userId automaticamente
    req.body.userId = req.user.id

    Comment.create(req.body, req.ip)
      .then((data) => {res.status(201).jsonp(data)})
      .catch((error) => res.status(500).jsonp(error))
  } else {
    res.status(401).jsonp({ error: "Autenticação necessária" })
  }
})

// DELETE /comments/:_id - eliminar comentário (autor ou admin)
router.delete("/:_id", auth, (req, res) => {
  if (req.user) {
    // Admin pode eliminar qualquer comentário
    if (req.user.isAdmin) {
      Comment.delete(req.params._id, req.user.id, req.ip, true)
        .then((data) => {res.status(200).jsonp({ message: "Comentário eliminado com sucesso" })})
        .catch((error) => res.status(500).jsonp({ error: error.message }))
    } else {
      Comment.delete(req.params._id, req.user.id, req.ip, false)
        .then((data) => {res.status(200).jsonp({ message: "Comentário eliminado com sucesso" })})
        .catch((error) => {
          if (error.message.includes("Não autorizado")) {
            res.status(403).jsonp({ error: error.message })
          } else {
            res.status(500).jsonp({ error: error.message })
          }
        })
    }
  } else {
    res.status(401).jsonp({ error: "Autenticação necessária" })
  }
})

// GET /comments/item/:itemId - comentários por item
router.get("/item/:itemId", (req, res) => {
  Comment.listByItem(req.params.itemId)
    .then((data) => {res.status(200).jsonp(data)})
    .catch((error) => res.status(500).jsonp(error))
})

// GET /comments/user/:userId - comentários por utilizador
router.get("/user/:userId", (req, res) => {
  Comment.listByUser(req.params.userId)
    .then((data) => {res.status(200).jsonp(data)})
    .catch((error) => res.status(500).jsonp(error))
})

// GET /comments/type/:type - comentários por tipo
router.get("/type/:type", auth, (req, res) => {
  if (req.user && req.user.isAdmin) {
    Comment.listByType(req.params.type)
      .then((data) => {res.status(200).jsonp(data)})
      .catch((error) => res.status(500).jsonp(error))
  } else {
    res.status(403).jsonp({ error: "Acesso restrito a administradores" })
  }
})

// GET /comments/replies/:commentId - respostas a um comentário
router.get("/replies/:commentId", (req, res) => {
  Comment.listReplies(req.params.commentId)
    .then((data) => {res.status(200).jsonp(data)})
    .catch((error) => res.status(500).jsonp(error))
})

module.exports = router
