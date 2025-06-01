var fs = require('fs');
var path = require('path');
var Item = require('../models/item');
var File = require('../models/file');

// Processar SIP (pacote ZIP)
module.exports.processSIP = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).jsonp({ error: "Nenhum ficheiro ZIP enviado" });
        }

        console.log('Processando SIP:', req.file.filename);

        // 1. Mover ZIP para local permanente
        const zipPath = req.file.path;
        const destDir = path.join('uploads/files', Date.now().toString());
        
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        
        const destPath = path.join(destDir, req.file.originalname);
        fs.copyFileSync(zipPath, destPath);

        // 2. Criar registo de ficheiro na BD
        const fileData = {
            originalName: req.file.originalname,
            filename: path.basename(destPath),
            path: destPath,
            mimetype: req.file.mimetype,
            size: req.file.size,
            fileType: 'archive'
        };
        
        const file = new File(fileData);
        const savedFile = await file.save();

        // 3. Criar item na BD
        const itemData = {
            title: req.body.title || req.file.originalname,
            description: req.body.description || 'SIP importado',
            type: 'zip',
            producer: req.body.producer || req.user.username,
            submitter: req.user.id,
            createdAt: new Date(),
            isPublic: req.body.isPublic === 'true',
            files: [savedFile._id]
        };

        if (req.body.category) {
            itemData.category = req.body.category;
        }

        const item = new Item(itemData);
        const savedItem = await item.save();

        // 4. Limpar ficheiro temporário
        fs.unlinkSync(zipPath);

        // 5. Resposta
        res.status(201).jsonp({
            message: "SIP processado com sucesso",
            item: savedItem,
            file: savedFile
        });

    } catch (error) {
        console.error('Erro ao processar SIP:', error);
        res.status(500).jsonp({ error: error.message });
    }
};