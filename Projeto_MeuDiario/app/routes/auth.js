var express = require("express")
var router = express.Router()
var axios = require("axios")

const API_URL = "http://localhost:25000"

// GET /login - Página de login
router.get("/login", (req, res, next) => {
  const error = req.query.error
  let errorMessage = null

  // Traduzir erros para português
  switch (error) {
    case "google_not_configured":
      errorMessage = "Autenticação Google não configurada"
      break
    case "google_auth_failed":
      errorMessage = "Falha na autenticação com Google"
      break
    case "no_token_received":
      errorMessage = "Nenhum token recebido"
      break
    case "invalid_token":
      errorMessage = "Token inválido"
      break
    default:
      errorMessage = error
  }

  res.render("auth/login", { title: "Login", error: errorMessage })
})

// POST /login - Processar login
router.post("/login", (req, res, next) => {
  var credentials = {
    username: req.body.username,
    password: req.body.password,
  }

  axios
    .post(API_URL + "/user/login", credentials)
    .then((resp) => {
      var data = resp.data
      // Guardar token na sessão
      req.session.token = data.token
      req.session.user = data.user
      res.redirect("/items/")
    })
    .catch((erro) => {
      console.log(erro)
      res.render("auth/login", {
        title: "Login",
        error: "Credenciais inválidas",
      })
    })
})

// GET /register - Página de registo
router.get("/register", (req, res, next) => {
  res.render("auth/register", { title: "Registar" })
})

// POST /register - Processar registo
router.post("/register", (req, res, next) => {
  var userData = {
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
  }

  axios
    .post(API_URL + "/user/register", userData)
    .then((resp) => {
      var data = resp.data
      // Guardar token na sessão
      req.session.token = data.token
      req.session.user = data.user
      res.redirect("/items/")
    })
    .catch((erro) => {
      console.log(erro)
      res.render("auth/register", {
        title: "Registar",
        error: "Erro ao criar conta",
      })
    })
})

// GET /logout - Logout
router.get("/logout", (req, res, next) => {
  req.session.destroy()
  res.redirect("/")
})

// Rota para iniciar autenticação Google
router.get("/google", (req, res, next) => {
  res.redirect(API_URL + "/auth/google")
})

// Callback do Google
router.get("/google/callback", (req, res, next) => {
  console.log("📥 Frontend received Google callback")

  // Verificar se há um token na URL
  const token = req.query.token

  if (!token) {
    console.error("❌ No token received in callback")
    return res.redirect("/auth/login?error=no_token_received")
  }

  console.log("✅ Token received from API:", token.substring(0, 20) + "...")

  // Fazer uma requisição para obter os dados do usuário
  axios
    .get(API_URL + "/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const userData = response.data
      console.log("✅ User data retrieved:", userData.name)

      // Guardar token e dados do usuário na sessão
      req.session.token = token
      req.session.user = userData

      // Redirecionar para a página principal
      res.redirect("/items/")
    })
    .catch((error) => {
      console.error("❌ Error retrieving user data:", error.message)
      if (error.response) {
        console.error("Response status:", error.response.status)
        console.error("Response data:", error.response.data)
      }
      res.redirect("/auth/login?error=invalid_token")
    })
})

module.exports = router
