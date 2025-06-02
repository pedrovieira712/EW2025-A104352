const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Verificar se as credenciais do Google estão configuradas
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET


// Configuração do Passport
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

// Estratégia Google (só se as credenciais estiverem disponíveis)
if (isGoogleConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:25000/auth/google/callback",
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log("Google profile:", {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
          })

          // Verificar se já existe um usuário com este Google ID
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            return done(null, user)
          }

          // Verificar se existe um usuário com o mesmo email
          if (profile.emails && profile.emails.length > 0) {
            user = await User.findOne({ email: profile.emails[0].value })

            if (user) {
              // Atualizar o usuário existente com o Google ID
              user.googleId = profile.id
              if (profile.photos && profile.photos.length > 0) {
                user.profilePicture = profile.photos[0].value
              }
              await user.save()
              return done(null, user)
            }
          }

          // Criar um novo usuário
          console.log("👤 Creating new user from Google profile")
          const newUser = new User({
            googleId: profile.id,
            username: `google_${profile.id}`,
            email: profile.emails ? profile.emails[0].value : `${profile.id}@google.com`,
            name: profile.displayName,
            password: await bcrypt.hash(Math.random().toString(36).substring(2), 10),
            profilePicture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
          })

          const savedUser = await newUser.save()
          console.log("✅ New user created:", savedUser.username)
          return done(null, savedUser)
        } catch (err) {
          console.error("❌ Error in Google strategy:", err)
          return done(err, null)
        }
      },
    ),
  )
}

// Função para gerar token JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  )
}

// Função para verificar se Google está configurado
const isGoogleEnabled = () => isGoogleConfigured

module.exports = {
  passport,
  generateToken,
  isGoogleEnabled,
}
