var express = require("express")
var router = express.Router()
var axios = require("axios")

const API_URL = "http://localhost:25000"

// Middleware de autenticação
function requireAuth(req, res, next) {
  if (req.session && req.session.token) {
    next()
  } else {
    res.redirect("/auth/login")
  }
}

// POST /comment - Criar novo comentário (só autenticados)
router.post("/", requireAuth, (req, res, next) => {
  var config = {
    headers: { Authorization: "Bearer " + req.session.token },
  }

  var commentData = {
    itemId: req.body.itemId,
    content: req.body.content,
    type: req.body.type || "note",
  }

  console.log("Criando comentário:", commentData)

  axios
    .post(API_URL + "/comment", commentData, config)
    .then((resp) => {
      console.log("Comentário criado com sucesso")
      res.redirect("/items/" + req.body.itemId + "?success=Comentário adicionado com sucesso")
    })
    .catch((erro) => {
      console.error("Erro ao criar comentário:", erro.response?.data || erro.message)
      res.redirect("/items/" + req.body.itemId + "?error=Erro ao adicionar comentário")
    })
})

// POST /comment/:id/delete - Eliminar comentário (autor ou admin)
router.post("/:id/delete", requireAuth, (req, res, next) => {
  var id = req.params.id
  var config = {
    headers: { Authorization: "Bearer " + req.session.token },
  }

  axios
    .delete(API_URL + "/comment/" + id, config)
    .then((resp) => {
      res.redirect("/items/" + req.body.itemId + "?success=Comentário eliminado com sucesso")
    })
    .catch((erro) => {
      console.error("Erro ao eliminar comentário:", erro)
      res.redirect("/items/" + req.body.itemId + "?error=Erro ao eliminar comentário")
    })
})

module.exports = router
