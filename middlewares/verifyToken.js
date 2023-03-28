const jwk = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    // xac thuc Authorization tu req header / Access Authorization
    const Authorization = req.header('Authorization');

    if (!Authorization){
        //Error: Unauthorized
    }

    //Lay token /get token
    // gui token tu client toi server co dang 'Bearer <tokenkey>'
    const token = Authorization.replace('Bearer ', '');

    //Xac thuc token
    const {userId} = jwk.verify(token, process.env.APP_SECRET);

    //gan token /assign token
    req.user = {userId};

    //de no di tiep vao controller
    next();
}