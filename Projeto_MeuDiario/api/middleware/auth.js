var jwt = require('jsonwebtoken');

// Chave secreta - idealmente em variável de ambiente
const SECRET = "EngWeb2025";


module.exports = function(req, res, next) {
    var token = req.get('Authorization');
    
    if (!token) {
        return res.status(401).jsonp({error: "Token inexistente"});
    }
    
    token = token.split(' ')[1];
    
    if (token) {
        jwt.verify(token, "EngWeb2025", (err, payload) => {
            if (err) {
                res.status(401).jsonp(err);
            } else {
                console.log(payload);
                req.user = payload;
                next();
            }
        });
    } else {
        res.status(401).jsonp({error: "Token inexistente"});
    }
};

// Middleware básico - verifica se token é válido
module.exports.verifyToken = (req, res, next) => {
    var token = req.headers.authorization;
    
    if (!token) return res.status(401).jsonp({error: "Token inexistente"});
    
    // Formato: "Bearer TOKEN"
    token = token.split(' ')[1];
    
    jwt.verify(token, SECRET, (err, payload) => {
        if (err) return res.status(401).jsonp({error: "Token inválido"});
        
        // Guarda payload no request para uso posterior
        req.user = payload;
        next();
    });
};

// Middleware para admin - verifica se é admin
module.exports.verifyAdmin = (req, res, next) => {
    var token = req.headers.authorization;
    
    if (!token) return res.status(401).jsonp({error: "Token inexistente"});
    
    token = token.split(' ')[1];
    
    jwt.verify(token, SECRET, (err, payload) => {
        if (err) return res.status(401).jsonp({error: "Token inválido"});
        
        if (payload.isAdmin) {
            req.user = payload;
            next();
        } else {
            res.status(403).jsonp({error: "Acesso restrito a administradores"});
        }
    });
};

// Função para gerar token
module.exports.generateToken = (user) => {
    // Não incluir password no payload!
    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
    };
    
    return jwt.sign(payload, SECRET, { expiresIn: '1d' });
};

module.exports = function auth(req, res, next) {
    var token = req.get('Authorization');
    
    if (!token) {
        return res.status(401).jsonp({error: "Token inexistente"});
    }
    
    token = token.split(' ')[1];
    
    if (token) {
        jwt.verify(token, "EngWeb2025", (err, payload) => {
            if (err) {
                res.status(401).jsonp(err);
            } else {
                console.log(payload);
                req.user = payload;
                next();
            }
        });
    } else {
        res.status(401).jsonp({error: "Token inexistente"});
    }
};