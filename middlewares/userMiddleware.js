const jwt = require('jsonwebtoken');

module.exports.ensureToken = function(req, res, next) { // Verify that the Bearer token match with JWT_SECRET_KEY
    var bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader === 'undefined')
        return res.status(400).json({error: 'accessToken undefined'});

    jwt.verify(bearerHeader.split(" ")[1], process.env.JWT_SECRET_KEY ||
    "09f26e402206e2faa8da4c98a35f1b20hdv033c6097befa8be348pa829587fe2f90a834d2bff9d42710a456095a2ce285b009f0c3730cdqtko1af3eb84df6611", (err, res_jwt) => {
        if (err) 
            return res.status(403).json(err);
        next();
    });
}