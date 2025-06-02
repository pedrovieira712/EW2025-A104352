var express = require("express")
var router = express.Router()

var Item = require("../controllers/item")
var auth = require("../middleware/auth")
var jwt = require("jsonwebtoken")

// GET /items - listar todos (públicos para não autenticados, todos para autenticados/admin)
router.get("/", (req, res) => {
  var token = req.get("Authorization")
  var showAll = false
  var showPrivate = req.query.private === "true"
  var submitterId = req.query.submitter

  // Se tem token, verificar se é admin ou se quer ver seus próprios
  if (token) {
    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || "EngWeb2025")
      if (decoded.isAdmin || submitterId) {
        showAll = true
      }
    } catch (err) {
      // Token inválido, continuar como não autenticado
    }
  }

  Item.list(showAll, showPrivate, submitterId)
    .then((data) => {
      res.status(200).jsonp(data)
    })
    .catch((error) => res.status(500).jsonp(error))
})

// GET /items/:_id - obter um item
router.get("/:_id", (req, res) => {
  Item.lookUp(req.params._id)
    .then((data) => res.status(200).jsonp(data))
    .catch((error) => res.status(500).jsonp(error))
})

// POST /items - criar novo (só autenticados)
router.post("/", auth, (req, res) => {
  if (req.user) {
    req.body.submitter = req.user.id

    Item.create(req.body)
      .then((data) => {
        res.status(201).jsonp(data)
      })
      .catch((error) => res.status(500).jsonp(error))
  }
})

// Melhorar a rota PUT para edição com melhor validação
router.put("/:_id", auth, (req, res) => {
  if (req.user) {
    const itemId = req.params._id

    console.log("API: Editando item", itemId, "por usuário", req.user.username)
    console.log("API: Dados recebidos:", req.body)

    // Primeiro verificar se o item existe e se o usuário pode editá-lo
    Item.lookUp(itemId)
      .then((item) => {
        if (!item) {
          console.log("API: Item não encontrado:", itemId)
          return res.status(404).jsonp({ error: "Item não encontrado" })
        }

        // Verificar permissões
        if (item.submitter._id.toString() !== req.user.id && !req.user.isAdmin) {
          console.log("API: Usuário sem permissão para editar item")
          return res.status(403).jsonp({ error: "Não autorizado a editar este item" })
        }

        // Atualizar o item
        return Item.update(itemId, req.body)
      })
      .then((updatedItem) => {
        if (updatedItem) {
          console.log("API: Item atualizado com sucesso:", updatedItem.title)
          res.status(200).jsonp(updatedItem)
        }
      })
      .catch((error) => {
        console.error("API: Erro ao atualizar item:", error)
        res.status(500).jsonp({ error: "Erro interno ao atualizar item" })
      })
  } else {
    res.status(401).jsonp({ error: "Não autenticado" })
  }
})

// Modificar a rota DELETE para incluir verificação de permissões

// DELETE /items/:_id - eliminar (só autenticados - autor ou admin)
router.delete("/:_id", auth, (req, res) => {
  if (req.user) {
    // Primeiro verificar se o item existe e se o usuário tem permissão
    Item.lookUp(req.params._id)
      .then((item) => {
        if (!item) {
          return res.status(404).jsonp({ error: "Item não encontrado" })
        }

        // Verificar se é o autor ou admin
        if (item.submitter._id.toString() !== req.user.id && !req.user.isAdmin) {
          return res.status(403).jsonp({ error: "Não autorizado a eliminar este item" })
        }

        // Eliminar o item
        return Item.delete(req.params._id)
      })
      .then((data) => {
        res.status(200).jsonp({ message: "Item eliminado com sucesso" })
      })
      .catch((error) => res.status(500).jsonp(error))
  }
})

// GET /items/category/:categoryId - filtrar por categoria
router.get("/category/:categoryId", (req, res) => {
  Item.listByCategory(req.params.categoryId)
    .then((data) => {
      res.status(200).jsonp(data)
    })
    .catch((error) => res.status(500).jsonp(error))
})

router.get("/new", (req, res) => {
  Item.list(true)
    .then((data) => {
      res.status(200).jsonp(data)
    })
    .catch((error) => res.status(500).jsonp(error))
})

module.exports = router
