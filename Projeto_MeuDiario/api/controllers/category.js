var Category = require('../models/category');

// Listar todas (ativas)
module.exports.list = () => {
    return Category.find({ isActive: true })
        .sort({ level: 1, name: 1 })
        .exec();
};

// Obter uma categoria
module.exports.lookUp = (id) => {
    return Category.findById(id)
        .populate('parent', 'name description')
        .exec();
};

// Criar nova categoria
module.exports.create = (categoryData) => {
    const category = new Category(categoryData);
    return category.save();
};

// Atualizar categoria
module.exports.update = (id, categoryData) => {
    return Category.findByIdAndUpdate(id, categoryData, { new: true })
        .populate('parent', 'name')
        .exec();
};

// Eliminar categoria (soft delete)
module.exports.delete = (id) => {
    return Category.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

// Listar categorias raiz (sem parent)
module.exports.listRoot = () => {
    return Category.find({ parent: null, isActive: true })
        .sort({ name: 1 })
        .exec();
};

// Listar subcategorias de uma categoria
module.exports.listChildren = (parentId) => {
    return Category.find({ parent: parentId, isActive: true })
        .populate("parent", "name")
        .sort({ name: 1 })
        .exec();
};