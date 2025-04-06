var Livro = require('../models/livro')

module.exports.list = () => {
    return Livro
        .find()
        .exec()
}

module.exports.findById = id => {
    return Livro
        .findOne({_id : id})
        .exec()
}

module.exports.getLivrosByCharacter = character => {  
    return Livro
        .find({ 
            characters: { $in: character }  
        })
        .exec()
}

module.exports.getLivrosByAutor = autor => {  
    return Livro
        .find({ 
            author: { $in: autor }  
        })
        .exec()
}

module.exports.getLivrosByGenre = genre => {  
    return Livro
        .find({ 
            genres: { $in: genre }  
        })
        .exec()
}

module.exports.getAllGenres = () => {
    return Livro.aggregate([
        { $unwind: "$genres" },
        { $group: { _id: "$genres" } }, 
        { $sort: { _id: 1 } }, 
        { $project: { _id: 0, genre: "$_id" } } 
    ]).exec(); 
};

module.exports.getAllCharacters = () => {
    return Livro.aggregate([
        { $unwind: "$characters" }, 
        { $group: { _id: "$characters" } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, character: "$_id" } } 
    ]).exec(); 
};

module.exports.insert = livro => {
        var newlivro = new Livro(livro)
        return newlivro.save()
}

module.exports.update = (id, livro) => {
    return Livro.findByIdAndUpdate(id, livro, {new : true})
    .exec()
}

module.exports.delete = id => {
    return Livro.findByIdAndDelete(id)
    .exec()
}