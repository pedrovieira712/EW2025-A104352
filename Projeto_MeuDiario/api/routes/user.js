var express = require("express")
var router = express.Router()
var jwt = require("jsonwebtoken")
var multer = require("multer")

var User = require("../controllers/user")
var auth = require("../middleware/auth")

// POST /users/register - registar
router.post("/register", (req, res) => {
  User.register(req.body)
    .then((data) => {
      res.status(201).jsonp(data)
    })
    .catch((error) => res.status(500).jsonp(error))
})

// POST /users/login - login
router.post("/login", (req, res) => {
  User.login(req.body)
    .then((data) => {
      res.status(200).jsonp(data)
    })
    .catch((error) => res.status(401).jsonp(error))
})

// GET /users/me - Obter dados do usuário autenticado
router.get("/me", auth, (req, res) => {
  if (req.user) {
    User.findById(req.user.id)
      .then((user) => {
        if (!user) {
          return res.status(404).jsonp({ error: "Usuário não encontrado" })
        }

        res.status(200).jsonp({
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          profilePicture: user.profilePicture,
        })
      })
      .catch((error) => {
        console.error("Erro ao buscar usuário:", error)
        res.status(500).jsonp({ error: "Erro ao buscar usuário" })
      })
  } else {
    res.status(401).jsonp({ error: "Não autenticado" })
  }
})

// GET /users - listar todos
router.get("/", auth, (req, res) => {
  if (req.user) {
    User.list()
      .then((data) => {
        res.status(200).jsonp(data)
      })
      .catch((error) => res.status(500).jsonp(error))
  }
})

// GET /users/:_id - obter um
router.get("/:_id", auth, (req, res) => {
  if (req.user) {
    User.lookUp(req.params._id)
      .then((data) => res.status(200).jsonp(data))
      .catch((error) => res.status(500).jsonp(error))
  }
})

// POST /users - criar novo
router.post("/", auth, (req, res) => {
  if (req.user) {
    User.create(req.body)
      .then((data) => {
        res.status(201).jsonp(data)
      })
      .catch((error) => res.status(500).jsonp(error))
  }
})

// PUT /users/:_id - atualizar
router.put("/:_id", auth, (req, res) => {
  if (req.user) {
    User.update(req.params._id, req.body)
      .then((data) => {
        res.status(200).jsonp(data)
      })
      .catch((error) => res.status(500).jsonp(error))
  }
})

// DELETE /users/:_id - eliminar
router.delete("/:_id", auth, (req, res) => {
  if (req.user) {
    User.delete(req.params._id)
      .then((data) => {
        res.status(200).jsonp(data)
      })
      .catch((error) => res.status(500).jsonp(error))
  }
})

module.exports = router
