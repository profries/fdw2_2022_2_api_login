const jwt = require('jsonwebtoken')

exports.validaToken = (req, res, next) => {
    //Header: x-auth-token  --> Token
    const token = req.get("x-auth-token");

    //Se nao existe token --> retorna 401
    if(!token) {
        res.status(401).json({erro: "Token invalido"});
    }
    else {
        jwt.verify(token, 'Sen@crs', (err, payload) => {
            if(err) {
                res.status(401).json({erro: "Token invalido"});
            }
            else {
                console.log("Payload: ", JSON.stringify(payload))
                next();
            }
        })
    }
}