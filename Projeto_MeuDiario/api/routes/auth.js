const express = require("express")
const router = express.Router()
const { passport, generateToken, isGoogleEnabled } = require("../middleware/passport")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

// URLs do frontend
const FRONTEND_BASE_URL = "http://localhost:25001"
const FRONTEND_LOGIN_URL = "http://localhost:25001/auth/login"

// Rota para verificar quais métodos de autenticação estão disponíveis
router.get("/methods", (req, res) => {
  res.json({
    google: isGoogleEnabled(),
    facebook: false, // Desabilitado
  })
})

// Rota para iniciar autenticação Google
router.get("/google", (req, res, next) => {
  if (!isGoogleEnabled()) {
    return res.status(400).json({
      error: "Google authentication not configured",
      message: "Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET",
    })
  }

  console.log("🚀 Initiating Google OAuth flow")
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next)
})

// Callback do Google
router.get("/google/callback", (req, res, next) => {
  if (!isGoogleEnabled()) {
    console.log("❌ Google not configured, redirecting to login")
    return res.redirect(`${FRONTEND_LOGIN_URL}?error=google_not_configured`)
  }

  console.log("📥 Google callback received")

  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_LOGIN_URL}?error=google_auth_failed`,
  })(req, res, () => {
    try {
      console.log("✅ Google authentication successful for user:", req.user.username)

      // Gerar token JWT
      const token = generateToken(req.user)

      // Em vez de usar cookies, passamos o token na URL
      console.log("🔑 Token generated, redirecting with token in URL")
      res.redirect(`${FRONTEND_BASE_URL}/auth/google/callback?token=${token}`)
    } catch (error) {
      console.error("❌ Error in Google callback:", error)
      res.redirect(`${FRONTEND_LOGIN_URL}?error=google_auth_failed`)
    }
  })
})

// Rota para verificar o token e obter dados do usuário
router.get("/verify-token", (req, res) => {
  console.log("🔍 Checking for token in cookies...")
  console.log("📋 All cookies:", req.cookies)

  const token = req.cookies.token

  if (!token) {
    console.log("❌ No token found in cookies")
    return res.status(401).json({ error: "Token não fornecido" })
  }

  try {
    console.log("🔍 Verifying token:", token.substring(0, 20) + "...")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("✅ Token decoded successfully for user ID:", decoded.id)

    // Buscar usuário pelo ID
    User.findById(decoded.id)
      .select("-password")
      .then((user) => {
        if (!user) {
          console.log("❌ User not found in database")
          return res.status(404).json({ error: "Usuário não encontrado" })
        }

        console.log("✅ Token verified for user:", user.username)
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            profilePicture: user.profilePicture,
          },
        })
      })
      .catch((err) => {
        console.error("❌ Error fetching user:", err)
        res.status(500).json({ error: "Erro ao buscar usuário" })
      })
  } catch (err) {
    console.error("❌ Error verifying token:", err)
    res.status(401).json({ error: "Token inválido" })
  }
})

// Rota para logout
router.post("/logout", (req, res) => {
  // Limpar cookie
  res.clearCookie("token")

  // Se usando sessões do Passport
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err)
      return res.status(500).json({ error: "Erro ao fazer logout" })
    }
    res.json({ message: "Logout realizado com sucesso" })
  })
})

module.exports = router
