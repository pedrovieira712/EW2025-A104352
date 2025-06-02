// Carregar variáveis de ambiente do ficheiro key.env
require("dotenv").config({ path: "./key.env" })

var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
var mongoose = require("mongoose")
var session = require("express-session")
var cors = require("cors")

// Importar configuração do Passport
const { passport } = require("./middleware/passport")

// Conectar ao MongoDB
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/diario_digital"
mongoose.connect(mongoUri)
var connection = mongoose.connection
connection.on("error", console.error.bind(console, "Erro na conexão a MongoDB"))
connection.once("open", () => console.log("Conexão estabelecida MongoDB"))

var userRouter = require("./routes/user")
var itemRouter = require("./routes/item")
var categoryRouter = require("./routes/category")
var fileRouter = require("./routes/file")
var sipRouter = require("./routes/sip")
var logRouter = require("./routes/log")
var commentRouter = require("./routes/comment")
var authRouter = require("./routes/auth")

var app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

// Configurar CORS
app.use(
  cors({
    origin: "http://localhost:25001",
    credentials: true,
  }),
)

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

// Configurar sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET || "EngWeb2025_Session",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true em produção com HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  }),
)

// Inicializar Passport
app.use(passport.initialize())
app.use(passport.session())

app.use("/user", userRouter)
app.use("/item", itemRouter)
app.use("/category", categoryRouter)
app.use("/file", fileRouter)
app.use("/sip", sipRouter)
app.use("/log", logRouter)
app.use("/comment", commentRouter)
app.use("/auth", authRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
