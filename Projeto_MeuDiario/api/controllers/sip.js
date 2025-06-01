var fs = require("fs")
var path = require("path")
var AdmZip = require("adm-zip")
var Item = require("../models/item")
var File = require("../models/file")
var Log = require("../models/log")

// Processar SIP (pacote ZIP)
module.exports.processSIP = async (req, res) => {
  console.log("🚀 Iniciando processamento SIP...")

  try {
    if (!req.file) {
      console.error("❌ Nenhum ficheiro ZIP enviado")
      return res.status(400).jsonp({ error: "Nenhum ficheiro ZIP enviado" })
    }

    console.log("📦 Processando SIP:", req.file.filename)
    console.log("📊 Tamanho do ficheiro:", req.file.size, "bytes")

    // 1. Verificar se o ficheiro existe
    const zipPath = req.file.path
    if (!fs.existsSync(zipPath)) {
      console.error("❌ Ficheiro ZIP não encontrado:", zipPath)
      return res.status(400).jsonp({ error: "Ficheiro ZIP não encontrado" })
    }

    // 2. Extrair ZIP
    const extractPath = path.join("uploads/temp", "extract_" + Date.now())
    console.log("📂 Extraindo para:", extractPath)

    try {
      const zip = new AdmZip(zipPath)
      const entries = zip.getEntries()
      console.log(
        "📋 Ficheiros no ZIP:",
        entries.map((e) => e.entryName),
      )

      zip.extractAllTo(extractPath, true)
      console.log("✅ ZIP extraído com sucesso")
    } catch (extractError) {
      console.error("❌ Erro ao extrair ZIP:", extractError.message)
      cleanupTemp(zipPath, extractPath)
      return res.status(400).jsonp({ error: "Erro ao extrair ZIP: " + extractError.message })
    }

    // 3. Procurar manifesto
    console.log("🔍 Procurando manifesto...")
    const manifestPath = findManifest(extractPath)
    if (!manifestPath) {
      console.error("❌ Manifesto não encontrado")
      cleanupTemp(zipPath, extractPath)
      return res.status(400).jsonp({
        error: "Manifesto não encontrado. Deve existir um ficheiro 'manifesto-SIP.json' na raiz do ZIP",
      })
    }
    console.log("✅ Manifesto encontrado:", manifestPath)

    // 4. Ler e validar manifesto
    console.log("📖 Lendo manifesto...")
    const manifest = readManifest(manifestPath)
    if (!manifest) {
      console.error("❌ Erro ao ler manifesto")
      cleanupTemp(zipPath, extractPath)
      return res.status(400).jsonp({ error: "Erro ao ler manifesto. Verifique se é um JSON válido." })
    }
    console.log("✅ Manifesto lido:", JSON.stringify(manifest, null, 2))

    // 5. Validar campos obrigatórios do manifesto
    const validationError = validateManifest(manifest)
    if (validationError) {
      console.error("❌ Manifesto inválido:", validationError)
      cleanupTemp(zipPath, extractPath)
      return res.status(400).jsonp({ error: validationError })
    }

    // 6. Validar ficheiros referenciados
    console.log("🔍 Validando ficheiros...")
    const validationResult = validateFiles(extractPath, manifest)
    if (!validationResult.valid) {
      console.error("❌ Ficheiros em falta:", validationResult.missing)
      cleanupTemp(zipPath, extractPath)
      return res.status(400).jsonp({
        error: "Ficheiros em falta: " + validationResult.missing.join(", "),
      })
    }
    console.log("✅ Todos os ficheiros encontrados")

    // 7. Criar item na BD
    console.log("💾 Criando item na base de dados...")
    const itemData = {
      title: manifest.title,
      description: manifest.description || "",
      type: manifest.type || "mixed",
      category: manifest.category,
      producer: manifest.producer,
      submitter: req.user.id,
      createdAt: manifest.createdAt ? new Date(manifest.createdAt) : new Date(),
      tags: manifest.tags || [],
      isPublic: manifest.isPublic || false,
      metadata: manifest.metadata || {},
    }

    const item = new Item(itemData)
    const savedItem = await item.save()
    console.log("✅ Item criado:", savedItem._id)

    // 8. Processar e mover ficheiros
    console.log("📁 Processando ficheiros...")
    const processedFiles = await processFiles(extractPath, manifest, savedItem._id)
    console.log("✅ Ficheiros processados:", processedFiles.length)

    // 9. Atualizar item com ficheiros
    savedItem.files = processedFiles.map((f) => f._id)
    await savedItem.save()

    // 10. Registar log
    await logActivity("upload", savedItem._id, req.user.id, req.ip, {
      sipFile: req.file.originalname,
      filesCount: processedFiles.length,
    })

    // 11. Limpar ficheiros temporários
    cleanupTemp(zipPath, extractPath)

    // 12. Resposta
    console.log("🎉 SIP processado com sucesso!")
    res.status(201).jsonp({
      message: "SIP processado com sucesso",
      item: savedItem,
      files: processedFiles,
    })
  } catch (error) {
    console.error("💥 Erro geral ao processar SIP:", error)
    res.status(500).jsonp({ error: "Erro interno: " + error.message })
  }
}

// Listar SIPs processados
module.exports.listProcessed = () => {
  return Item.find()
    .populate("category", "name")
    .populate("submitter", "username name")
    .populate("files")
    .sort({ submittedAt: -1 })
    .exec()
}

// Exportar item como DIP (ZIP)
module.exports.exportDIP = async (req, res) => {
  try {
    const itemId = req.params.id
    const item = await Item.findById(itemId).populate("files")

    if (!item) {
      return res.status(404).jsonp({ error: "Item não encontrado" })
    }

    // Criar ZIP para download
    const zip = new AdmZip()

    // Adicionar manifesto
    const manifest = {
      title: item.title,
      description: item.description,
      type: item.type,
      producer: item.producer,
      createdAt: item.createdAt,
      files: item.files.map((f) => ({
        filename: f.originalName,
        description: f.originalName,
        type: f.fileType,
      })),
      metadata: item.metadata,
    }

    zip.addFile("manifesto-SIP.json", Buffer.from(JSON.stringify(manifest, null, 2)))

    // Adicionar ficheiros
    for (const file of item.files) {
      if (fs.existsSync(file.path)) {
        zip.addLocalFile(file.path, "", file.originalName)
      }
    }

    // Registar log de download
    await logActivity("download", itemId, req.user ? req.user.id : null, req.ip, {
      exportFormat: "zip",
    })

    // Enviar ZIP
    const zipBuffer = zip.toBuffer()
    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${item.title}.zip"`,
    })
    res.send(zipBuffer)
  } catch (error) {
    console.error("Erro ao exportar DIP:", error)
    res.status(500).jsonp({ error: error.message })
  }
}

// === FUNÇÕES AUXILIARES ===

// Procurar manifesto no diretório extraído
function findManifest(extractPath) {
  const possibleNames = ["manifesto-SIP.json", "manifesto-SIP.xml"]

  console.log("🔍 Procurando manifesto em:", extractPath)

  // Listar todos os ficheiros no diretório
  try {
    const files = fs.readdirSync(extractPath)
    console.log("📁 Ficheiros encontrados:", files)
  } catch (error) {
    console.error("❌ Erro ao ler diretório:", error.message)
    return null
  }

  for (const name of possibleNames) {
    const fullPath = path.join(extractPath, name)
    console.log("🔍 Verificando:", fullPath)
    if (fs.existsSync(fullPath)) {
      console.log("✅ Manifesto encontrado:", fullPath)
      return fullPath
    }
  }

  console.log("❌ Nenhum manifesto encontrado")
  return null
}

// Ler manifesto (JSON ou XML)
function readManifest(manifestPath) {
  try {
    console.log("📖 Lendo manifesto:", manifestPath)
    const content = fs.readFileSync(manifestPath, "utf8")
    console.log("📄 Conteúdo do manifesto:", content)

    if (manifestPath.endsWith(".json")) {
      const parsed = JSON.parse(content)
      console.log("✅ JSON parseado com sucesso")
      return parsed
    } else if (manifestPath.endsWith(".xml")) {
      // Para XML, seria necessário um parser (xml2js)
      console.error("❌ Suporte XML não implementado ainda")
      throw new Error("Suporte XML não implementado ainda")
    }
  } catch (error) {
    console.error("❌ Erro ao ler manifesto:", error.message)
    return null
  }
}

// Validar campos obrigatórios do manifesto
function validateManifest(manifest) {
  const requiredFields = ["title", "producer"]

  for (const field of requiredFields) {
    if (!manifest[field]) {
      return `Campo obrigatório em falta no manifesto: ${field}`
    }
  }

  return null // Sem erros
}

// Validar se todos os ficheiros referenciados existem
function validateFiles(extractPath, manifest) {
  const missing = []

  if (manifest.files && Array.isArray(manifest.files)) {
    console.log("🔍 Validando", manifest.files.length, "ficheiros...")

    for (const fileRef of manifest.files) {
      const filename = fileRef.filename || fileRef
      const filePath = path.join(extractPath, filename)
      console.log("🔍 Verificando ficheiro:", filePath)

      if (!fs.existsSync(filePath)) {
        console.log("❌ Ficheiro em falta:", filename)
        missing.push(filename)
      } else {
        console.log("✅ Ficheiro encontrado:", filename)
      }
    }
  } else {
    console.log("ℹ️ Nenhum ficheiro referenciado no manifesto")
  }

  return {
    valid: missing.length === 0,
    missing: missing,
  }
}

// Processar e mover ficheiros para local permanente
async function processFiles(extractPath, manifest, itemId) {
  const processedFiles = []

  if (!manifest.files || !Array.isArray(manifest.files)) {
    console.log("ℹ️ Nenhum ficheiro para processar")
    return processedFiles
  }

  // Criar diretório para o item
  const itemDir = path.join("uploads/files", itemId.toString())
  if (!fs.existsSync(itemDir)) {
    fs.mkdirSync(itemDir, { recursive: true })
    console.log("📁 Diretório criado:", itemDir)
  }

  for (const fileRef of manifest.files) {
    try {
      const filename = fileRef.filename || fileRef
      const sourcePath = path.join(extractPath, filename)
      const destPath = path.join(itemDir, filename)

      console.log("📁 Movendo ficheiro:", filename)

      // Copiar ficheiro
      fs.copyFileSync(sourcePath, destPath)

      // Obter informações do ficheiro
      const stats = fs.statSync(destPath)

      // Determinar tipo de ficheiro
      const fileType = getFileType(filename)

      // Criar registo na BD
      const fileData = {
        originalName: filename,
        filename: filename,
        path: destPath,
        mimetype: getMimeType(filename),
        size: stats.size,
        itemId: itemId,
        fileType: fileType,
      }

      const file = new File(fileData)
      const savedFile = await file.save()
      processedFiles.push(savedFile)

      console.log("✅ Ficheiro processado:", filename)
    } catch (error) {
      console.error("❌ Erro ao processar ficheiro:", fileRef.filename || fileRef, error.message)
    }
  }

  return processedFiles
}

// Determinar tipo de ficheiro
function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase()

  if ([".jpg", ".jpeg", ".png", ".gif", ".bmp"].includes(ext)) return "image"
  if ([".pdf", ".doc", ".docx", ".txt"].includes(ext)) return "document"
  if ([".mp4", ".avi", ".mov"].includes(ext)) return "video"
  if ([".mp3", ".wav", ".ogg"].includes(ext)) return "audio"
  if ([".zip", ".rar", ".7z"].includes(ext)) return "archive"

  return "other"
}

// Obter MIME type
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase()

  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".mp4": "video/mp4",
    ".mp3": "audio/mpeg",
    ".zip": "application/zip",
  }

  return mimeTypes[ext] || "application/octet-stream"
}

// Limpar ficheiros temporários
function cleanupTemp(zipPath, extractPath) {
  try {
    // Remover ZIP
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath)
      console.log("🗑️ ZIP temporário removido")
    }

    // Remover diretório extraído
    if (fs.existsSync(extractPath)) {
      fs.rmSync(extractPath, { recursive: true, force: true })
      console.log("🗑️ Diretório temporário removido")
    }
  } catch (error) {
    console.error("⚠️ Erro ao limpar ficheiros temporários:", error.message)
  }
}

// Registar atividade nos logs
async function logActivity(action, itemId, userId, ip, details) {
  try {
    const log = new Log({
      action: action,
      itemId: itemId,
      userId: userId,
      ip: ip,
      details: details,
    })
    await log.save()
    console.log("📝 Log registado:", action)
  } catch (error) {
    console.error("⚠️ Erro ao registar log:", error.message)
  }
}
