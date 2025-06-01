var Log = require('../models/log');

// Listar todos os logs
module.exports.list = () => {
    return Log.find()
        .populate('userId', 'username name')
        .populate('itemId', 'title')
        .sort({ timestamp: -1 })
        .exec();
};

// Obter um log específico
module.exports.lookUp = (id) => {
    return Log.findById(id)
        .populate('userId', 'username name')
        .populate('itemId', 'title')
        .exec();
};

// Criar novo log
module.exports.create = (logData) => {
    const log = new Log(logData);
    return log.save();
};

// Eliminar log
module.exports.delete = (id) => {
    return Log.findByIdAndDelete(id);
};

// Listar logs por utilizador
module.exports.listByUser = (userId) => {
    return Log.find({ userId: userId })
        .populate('itemId', 'title')
        .sort({ timestamp: -1 })
        .exec();
};

// Listar logs por item
module.exports.listByItem = (itemId) => {
    return Log.find({ itemId: itemId })
        .populate('userId', 'username name')
        .sort({ timestamp: -1 })
        .exec();
};

// Listar logs por tipo de ação
module.exports.listByAction = (action) => {
    return Log.find({ action: action })
        .populate('userId', 'username name')
        .populate('itemId', 'title')
        .sort({ timestamp: -1 })
        .exec();
};

// Estatísticas de logs
module.exports.getStats = async () => {
    try {
        // Total por tipo de ação
        const actionStats = await Log.aggregate([
            { $group: { _id: "$action", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Total por dia (últimos 7 dias)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const dailyStats = await Log.aggregate([
            { $match: { timestamp: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$timestamp" },
                        month: { $month: "$timestamp" },
                        day: { $dayOfMonth: "$timestamp" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Itens mais vistos
        const topItems = await Log.aggregate([
            { $match: { action: "view" } },
            { $group: { _id: "$itemId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Utilizadores mais ativos
        const topUsers = await Log.aggregate([
            { $group: { _id: "$userId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        return {
            actionStats,
            dailyStats,
            topItems,
            topUsers,
            total: await Log.countDocuments()
        };
    } catch (error) {
        console.error('Erro ao gerar estatísticas:', error);
        throw error;
    }
};

// Registar atividade (helper function)
module.exports.registerActivity = async (action, itemId, userId, ip, details = {}) => {
    try {
        const log = new Log({
            action,
            itemId,
            userId,
            ip,
            details,
            timestamp: new Date()
        });
        
        return await log.save();
    } catch (error) {
        console.error('Erro ao registar atividade:', error);
        // Não lançar erro para não interromper o fluxo principal
        return null;
    }
};

// Exportar logs para ficheiro
module.exports.exportLogs = async (filter = {}) => {
    try {
        const logs = await Log.find(filter)
            .populate('userId', 'username name')
            .populate('itemId', 'title')
            .sort({ timestamp: -1 })
            .lean()
            .exec();
        
        return logs;
    } catch (error) {
        console.error('Erro ao exportar logs:', error);
        throw error;
    }
};