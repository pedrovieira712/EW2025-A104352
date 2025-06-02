var User = require("../models/user")
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")

module.exports.list = () => {
  return User.find().sort({ nome: 1 }).exec()
}

module.exports.lookUp = (id) => {
  return User.findOne({ _id: id }).exec()
}

// Novo método para buscar usuário por ID (sem senha)
module.exports.findById = (id) => {
  return User.findById(id).select("-password").exec()
}

// Criar novo
module.exports.create = async (userData) => {
  const salt = await bcrypt.genSalt(10)
  userData.password = await bcrypt.hash(userData.password, salt)

  const user = new User(userData)
  return user.save()
}

// Atualizar
module.exports.update = async (id, userData) => {
  if (userData.password) {
    const salt = await bcrypt.genSalt(10)
    userData.password = await bcrypt.hash(userData.password, salt)
  }

  return User.findByIdAndUpdate(id, userData, { new: true }).select("-password")
}

// Eliminar
module.exports.delete = (id) => {
  return User.findByIdAndDelete(id)
}

// Registar
module.exports.register = async (userData) => {
  // Verificar se já existe
  const existing = await User.findOne({
    $or: [{ username: userData.username }, { email: userData.email }],
  })

  if (existing) {
    throw new Error("Utilizador já existe")
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  userData.password = await bcrypt.hash(userData.password, salt)

  const user = new User(userData)
  const savedUser = await user.save()

  // Gerar token
  const token = jwt.sign(
    {
      id: savedUser._id,
      username: savedUser.username,
      isAdmin: savedUser.isAdmin,
    },
    process.env.JWT_SECRET || "EngWeb2025",
    { expiresIn: "1d" },
  )

  return {
    token,
    user: {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      name: savedUser.name,
      isAdmin: savedUser.isAdmin,
    },
  }
}

// Login
module.exports.login = async (credentials) => {
  const user = await User.findOne({ username: credentials.username })

  if (!user) {
    throw new Error("Utilizador não encontrado")
  }

  const validPassword = await bcrypt.compare(credentials.password, user.password)

  if (!validPassword) {
    throw new Error("Password incorreta")
  }

  // Gerar token
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || "EngWeb2025",
    { expiresIn: "1d" },
  )

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    },
  }
}
