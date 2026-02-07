const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {

    // Intentar leer token desde cookie
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).send("Acceso denegado. No hay token");
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = verificado;

        next();

    } catch (error) {
        return res.status(401).send("Token inválido o expirado");
    }
}

module.exports = verificarToken;
