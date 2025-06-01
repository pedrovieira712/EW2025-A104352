var File = require('../models/file');
var fs = require('fs');

// Listar todos os ficheiros
module.exports.list = () => {
    return File.find()
        .populate('itemId', 'title')
        .sort({ uploadedAt: -1 })
        .exec();
};

// Obter um ficheiro
module.exports.lookUp = (id) => {
    return File.findById(id)
        .populate('itemId', 'title description')
        .exec();
};

// Criar novo ficheiro (usado no upload)
module.exports.create = (fileData) => {
    const file = new File(fileData);
    return file.save();
};

// Eliminar ficheiro (e ficheiro físico)
module.exports.delete = async (id) => {
    try {
        const file = await File.findById(id);
        if (file) {
            // Eliminar ficheiro físico
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            // Eliminar da BD
            return File.findByIdAndDelete(id);
        }
        return null;
    } catch (error) {
        throw error;
    }
};

// Listar ficheiros por item
module.exports.listByItem = (itemId) => {
    return File.find({ itemId: itemId })
        .sort({ uploadedAt: 1 })
        .exec();
};

// Listar por tipo de ficheiro
module.exports.listByType = (fileType) => {
    return File.find({ fileType: fileType })
        .populate('itemId', 'title')
        .sort({ uploadedAt: -1 })
        .exec();
};