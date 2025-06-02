var express = require("express")
var router = express.Router()
var axios = require("axios")
var multer = require("multer")
var FormData = require("form-data")
var fs = require("fs")

const API_URL = "http://localhost:25000"

// Configuração multer para upload de arquivos
var upload = multer({ dest: "uploads/temp/" })

// Middleware de autenticação
function requireAuth(req, res, next) {
  if (req.session && req.session.token) {
    next()
  } else {
    res.redirect("/auth/login")
  }
}

router.use(requireAuth)

// GET /dashboard - Dashboard do usuário
router.get("/dashboard", (req, res, next) => {
  var config = {
    headers: { Authorization: "Bearer " + req.session.token },
  }

  Promise.all([
    // Buscar conteúdos públicos do usuário
    axios.get(API_URL + "/item?submitter=" + req.session.user.id, config),
    // Buscar conteúdos privados do usuário
    axios.get(API_URL + "/item?submitter=" + req.session.user.id + "&private=true", config),
    // Se for admin, buscar todos os conteúdos
    req.session.user.isAdmin ? axios.get(API_URL + "/item?showAll=true", config) : Promise.resolve({ data: [] }),
  ])
    .then((responses) => {
      var allUserItems = responses[0].data
      var privateItems = responses[1].data
      var publicItems = allUserItems.filter((item) => item.isPublic)
      var allItems = responses[2].data

      res.status(200)
      res.render("items/dashboard", {
        title: "Meus Conteúdos",
        user: req.session.user,
        publicItems: publicItems,
        privateItems: privateItems,
        allItems: req.session.user.isAdmin ? allItems : [],
        error: req.query.error,
      })
    })
    .catch((erro) => {
      console.log(erro)
      res.render("error", { error: erro })
    })
})

// GET /new - Criar novo item
router.get("/new", (req, res, next) => {
  var config = {
    headers: { Authorization: "Bearer " + req.session.token },
  }

  axios
    .get(API_URL + "/category", config)
    .then((resp) => {
      var categories = resp.data
      res.status(200)
      res.render("items/new", {
        title: "Novo Item",
        user: req.session.user,
        categories: categories,
      })
    })
    .catch((erro) => {
      console.log(erro)
      res.render("error", { error: erro })
    })
})

// POST /new - Processar novo item com arquivos
router.post("/new", upload.array("files", 10), (req, res, next) => {
  var config = {
    headers: { Authorization: "Bearer " + req.session.token },
  }

  // Preparar dados do item
  var itemData = {
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    category: req.body.category || null,
    producer: req.body.producer,
    isPublic: req.body.isPublic === "on",
    createdAt: req.body.createdAt,
    tags: req.body.tags ? req.body.tags.split(",").map((tag) => tag.trim()) : [],
  }

  // Se não há arquivos, criar item simples
  if (!req.files || req.files.length === 0) {
    axios
      .post(API_URL + "/item", itemData, config)
      .then((resp) => {
        res.redirect("/items/dashboard")
      })
      .catch((erro) => {
        console.log(erro)
        res.render("items/new", {
          title: "Novo Item",
          user: req.session.user,
          error: "Erro ao criar item",
        })
      })
  } else {
    // Criar item com arquivos via API de arquivos
    createItemWithFiles(itemData, req.files, config, res, req.session.user)
  }
})

// Função para criar item com arquivos
async function createItemWithFiles(itemData, files, config, res, user) {
  try {
    // 1. Criar o item primeiro
    const itemResponse = await axios.post(API_URL + "/item", itemData, config)
    const item = itemResponse.data

    // 2. Upload dos arquivos
    const uploadedFiles = []

    for (const file of files) {
      try {
        // Criar FormData para cada arquivo
        const formData = new FormData()
        formData.append("file", fs.createReadStream(file.path), file.originalname)
        formData.append("itemId", item._id)

        const fileConfig = {
          headers: {
            Authorization: "Bearer " + config.headers.Authorization.split(" ")[1],
            ...formData.getHeaders(),
          },
        }

        // Upload do arquivo via API
        const fileResponse = await axios.post(API_URL + "/file/upload", formData, fileConfig)
        uploadedFiles.push(fileResponse.data)

        // Limpar arquivo temporário
        fs.unlinkSync(file.path)
      } catch (fileError) {
        console.error("Erro ao fazer upload do arquivo:", file.originalname, fileError.message)
        // Continuar com outros arquivos mesmo se um falhar
      }
    }

    // 3. Atualizar item com IDs dos arquivos
    if (uploadedFiles.length > 0) {
      const updateData = {
        files: uploadedFiles.map((f) => f._id),
      }

      await axios.put(API_URL + "/item/" + item._id, updateData, config)
    }

    res.redirect("/items/dashboard")
  } catch (error) {
    console.error("Erro ao criar item com arquivos:", error.message)

    // Limpar arquivos temporários em caso de erro
    files.forEach((file) => {
      try {
        fs.unlinkSync(file.path)
      } catch (e) {
        // Ignorar erros de limpeza
      }
    })

    res.render("items/new", {
      title: "Novo Item",
      user: user,
      error: "Erro ao criar item com arquivos",
    })
  }
}

// Melhorar a rota GET /edit/:id com melhor tratamento de erros
router.get("/edit/:id", (req, res, next) => {
  var id = req.params.id
  var config = {
    headers: { Authorization: "Bearer " + req.session.token },
  }

  console.log("Carregando item para edição:", id)

  Promise.all([axios.get(API_URL + "/item/" + id, config), axios.get(API_URL + "/category", config)])
    .then((responses) => {
      var item = responses[0].data
      var categories = responses[1].data

      console.log("Item carregado:", item.title)

      // Verificar se o usuário pode editar este item
      if (item.submitter._id !== req.session.user.id && !req.session.user.isAdmin) {
        return res.redirect(`/items/${id}?error=${encodeURIComponent("Não tem permissão para editar este item")}`)
      }

      res.status(200)
      res.render("items/edit", {
        title: "Editar Item - " + item.title,
        user: req.session.user,
        item: item,
        categories: categories,
        success: req.query.success,
        error: req.query.error,
      })
    })
    .catch((erro) => {
      console.error("Erro ao carregar item para edição:", erro.response?.data || erro.message)

      let errorMessage = "Erro ao carregar item"
      if (erro.response && erro.response.status === 404) {
        errorMessage = "Item não encontrado"
      } else if (erro.response && erro.response.status === 403) {
        errorMessage = "Não tem permissão para aceder a este item"
      }

      res.redirect("/items/dashboard?error=" + encodeURIComponent(errorMessage))
    })
})

// POST /edit/:id - Processar edição
router.post("/edit/:id", (req, res, next) => {
  var id = req.params.id
  var config = {
    headers: { Authorization: "Bearer " + req.session.token },
  }

  // Preparar dados do item
  var itemData = {
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    category: req.body.category || null,
    producer: req.body.producer,
    isPublic: req.body.isPublic === "on",
    createdAt: req.body.createdAt,
  }

  // Processar tags
  if (req.body.tags) {
    itemData.tags = req.body.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
  }

  console.log("Editando item:", id, "com dados:", itemData)

  axios
    .put(API_URL + "/item/" + id, itemData, config)
    .then((resp) => {
      console.log("Item editado com sucesso")
      res.redirect(`/items/${id}?success=${encodeURIComponent("Item editado com sucesso!")}`)
    })
    .catch((erro) => {
      console.error("Erro ao editar item:", erro.response?.data || erro.message)

      let errorMessage = "Erro ao editar item"
      if (erro.response && erro.response.data && erro.response.data.error) {
        errorMessage = erro.response.data.error
      } else if (erro.response && erro.response.status === 404) {
        errorMessage = "Item não encontrado"
      } else if (erro.response && erro.response.status === 403) {
        errorMessage = "Não tem permissão para editar este item"
      }

      // Buscar dados novamente para reexibir o formulário
      Promise.all([
        axios.get(API_URL + "/item/" + id, config).catch(() => null),
        axios.get(API_URL + "/category", config).catch(() => ({ data: [] })),
      ])
        .then((responses) => {
          const item = responses[0]?.data
          const categories = responses[1]?.data || []

          if (!item) {
            return res.redirect("/items/dashboard?error=" + encodeURIComponent("Item não encontrado"))
          }

          res.render("items/edit", {
            title: "Editar Item",
            user: req.session.user,
            item: item,
            categories: categories,
            error: errorMessage,
          })
        })
        .catch(() => {
          res.redirect("/items/dashboard?error=" + encodeURIComponent(errorMessage))
        })
    })
})

// POST /delete/:id - Eliminar item
router.post("/delete/:id", (req, res, next) => {
  var id = req.params.id
  var config = {
    headers: { Authorization: "Bearer " + req.session.token },
  }

  axios
    .delete(API_URL + "/item/" + id, config)
    .then((resp) => {
      res.redirect("/items/dashboard")
    })
    .catch((erro) => {
      console.log(erro)
      res.redirect("/items/dashboard?error=Erro ao eliminar item")
    })
})

// GET /items/:id - Ver item público
router.get("/:id", (req, res, next) => {
  var id = req.params.id

  // Buscar item e comentários
  Promise.all([axios.get(API_URL + "/item/" + id), axios.get(API_URL + "/comment/item/" + id)])
    .then((responses) => {
      var item = responses[0].data
      var comments = responses[1].data
      res.status(200)
      res.render("items/view", {
        title: item.title,
        item: item,
        user: req.session.user,
        comments: comments,
        success: req.query.success,
        error: req.query.error,
      })
    })
    .catch((erro) => {
      console.log(erro)
      res.render("error", { error: erro })
    })
})

module.exports = router
