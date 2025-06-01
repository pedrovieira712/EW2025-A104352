var express = require('express');
var router = express.Router();

var SIP = require('../controllers/sip');
var auth = require('../middleware/auth');
var upload = require('../middleware/upload');

// POST /sip/upload - Upload de pacote SIP
router.post('/upload', auth, upload.uploadSIP, function(req, res) {
    if (req.user) {
        SIP.processSIP(req, res);
    }
});

// GET /sip/processed - Listar SIPs processados
router.get('/processed', auth, function(req, res) {
    if (req.user) {
        SIP.listProcessed()
            .then(data => {
                res.status(200).jsonp(data);
            })
            .catch(error => res.status(500).jsonp(error));
    }
});

// GET /sip/export/:id - Exportar item como DIP
router.get('/export/:id', function(req, res) {
    SIP.exportDIP(req, res);
});

module.exports = router;