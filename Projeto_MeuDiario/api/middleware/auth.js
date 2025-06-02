var jwt = require("jsonwebtoken")

// Middleware básico - verifica se token é válido
module.exports = (req, res, next) => {
  var token = req.headers.authorization

  if (!token) {
    console.error("No token")
    return res.status(401).jsonp({ error: "Token inexistente" })
  }

  // Formato: "Bearer TOKEN"
  token = token.split(" ")[1]

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET || "EngWeb2025", (err, payload) => {
      if (err) {
        console.error("Token verificacao -", err.message)
        res.status(401).jsonp({ error: "Token inválido", details: err.message })
      } else {
        console.log("Token verified -", payload.username)
        req.user = payload
        next()
      }
    })
  } else {
    console.error("No token")
    res.status(401).jsonp({ error: "Token inexistente" })
  }
}

// Middleware básico - verifica se token é válido
module.exports.verifyToken = (req, res, next) => {
  var token = req.headers.authorization

  if (!token) return res.status(401).jsonp({ error: "Token inexistente" })

  // Formato: "Bearer TOKEN"
  token = token.split(" ")[1]

  jwt.verify(token, process.env.JWT_SECRET || "EngWeb2025", (err, payload) => {
    if (err) return res.status(401).jsonp({ error: "Token inválido" })

    // Guarda payload no request para uso posterior
    req.user = payload
    next()
  })
}

// Middleware para admin - verifica se é admin
module.exports.verifyAdmin = (req, res, next) => {
  var token = req.headers.authorization

  if (!token) return res.status(401).jsonp({ error: "Token inexistente" })

  token = token.split(" ")[1]

  jwt.verify(token, process.env.JWT_SECRET || "EngWeb2025", (err, payload) => {
    if (err) return res.status(401).jsonp({ error: "Token inválido" })

    if (payload.isAdmin) {
      req.user = payload
      next()
    } else {
      res.status(403).jsonp({ error: "Acesso restrito a administradores" })
    }
  })
}

// Função para gerar token
module.exports.generateToken = (user) => {
  // Não incluir password no payload!
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
  }

  return jwt.sign(payload, process.env.JWT_SECRET || "EngWeb2025", { expiresIn: "1d" })
}
