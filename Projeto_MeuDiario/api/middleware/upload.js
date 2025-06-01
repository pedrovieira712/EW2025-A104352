var multer = require('multer');
var path = require('path');
var fs = require('fs');

// Criar diretórios se não existirem
const createDirs = () => {
    const dirs = ['uploads', 'uploads/temp', 'uploads/files'];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Diretório ${dir} criado com sucesso`);
        }
    });
};

createDirs();

// Configuração do multer para SIP
const sipStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = "uploads/temp/"
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true })
        }
        cb(null, tempDir)
    },
    filename: function (req, file, cb) {
        // Nome único: timestamp + nome original
        const uniqueName = Date.now() + '-' + file.originalname;
        console.log(`Upload iniciado: ${file.originalname} -> ${uniqueName}`);
        cb(null, uniqueName);
    }
});

// Filtro para aceitar apenas ZIP
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/zip' || 
        file.mimetype === 'application/x-zip-compressed' ||
        path.extname(file.originalname).toLowerCase() === '.zip') {
        console.log(`Arquivo ZIP aceito: ${file.originalname}`);
        cb(null, true);
    } else {
        console.log(`Arquivo rejeitado: ${file.originalname} (MIME: ${file.mimetype})`);
        cb(new Error('Apenas ficheiros ZIP são permitidos!'), false);
    }
};

// Configuração do upload
const uploadSIP = multer({
    storage: sipStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});


module.exports = {
    uploadSIP: uploadSIP.single('zipFile'),
    createDirs
};