var express = require("express")
var router = express.Router()
var multer = require("multer")
var path = require("path")
var fs = require("fs")

var File = require("../controllers/file")
var auth = require("../middleware/auth")

// Configuração do multer para upload individual
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/files"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Nome único: timestamp + nome original
    const uniqueName = Date.now() + "-" + file.originalname
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
})

// POST /files/upload - Upload de arquivo individual
router.post("/upload", auth, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).jsonp({ error: "Nenhum arquivo enviado" })
  }

  try {
    // Determinar tipo de arquivo
    const fileType = getFileType(req.file.originalname)

    const fileData = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      itemId: req.body.itemId || null,
      fileType: fileType,
    }

    File.create(fileData)
      .then((savedFile) => {
        res.status(201).jsonp(savedFile)
      })
      .catch((error) => {
        console.error("Erro ao salvar arquivo na BD:", error)
        res.status(500).jsonp({ error: "Erro ao salvar arquivo" })
      })
  } catch (error) {
    console.error("Erro no upload:", error)
    res.status(500).jsonp({ error: "Erro no upload do arquivo" })
  }
})

// GET /files - listar todos (só autenticados)
router.get("/", auth, (req, res) => {
  if (req.user) {
    File.list()
      .then((data) => {
        res.status(200).jsonp(data)
      })
      .catch((error) => res.status(500).jsonp(error))
  }
})

// GET /files/:_id - obter um ficheiro
router.get("/:_id", (req, res) => {
  File.lookUp(req.params._id)
    .then((data) => res.status(200).jsonp(data))
    .catch((error) => res.status(500).jsonp(error))
})

// GET /files/download/:_id - download de ficheiro
router.get("/download/:_id", (req, res) => {
  File.lookUp(req.params._id)
    .then((file) => {
      if (file) {
        res.download(file.path, file.originalName)
      } else {
        res.status(404).jsonp({ error: "Ficheiro não encontrado" })
      }
    })
    .catch((error) => res.status(500).jsonp(error))
})

// GET /files/preview/:_id - preview de imagem
router.get("/preview/:_id", (req, res) => {
  File.lookUp(req.params._id)
    .then((file) => {
      if (file) {
        // Verificar se é uma imagem
        if (file.mimetype.startsWith("image/")) {
          res.sendFile(path.resolve(file.path))
        } else {
          res.status(400).jsonp({ error: "Arquivo não é uma imagem" })
        }
      } else {
        res.status(404).jsonp({ error: "Ficheiro não encontrado" })
      }
    })
    .catch((error) => res.status(500).jsonp(error))
})

// DELETE /files/:_id - eliminar ficheiro (só autenticados)
router.delete("/:_id", auth, (req, res) => {
  if (req.user) {
    File.delete(req.params._id)
      .then((data) => {
        res.status(200).jsonp(data)
      })
      .catch((error) => res.status(500).jsonp(error))
  }
})

// Função auxiliar para determinar tipo de arquivo
function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase()

  if ([".jpg", ".jpeg", ".png", ".gif", ".bmp"].includes(ext)) return "image"
  if ([".pdf", ".doc", ".docx", ".txt"].includes(ext)) return "document"
  if ([".mp4", ".avi", ".mov"].includes(ext)) return "video"
  if ([".mp3", ".wav", ".ogg"].includes(ext)) return "audio"
  if ([".zip", ".rar", ".7z"].includes(ext)) return "archive"

  return "other"
}

module.exports = router
