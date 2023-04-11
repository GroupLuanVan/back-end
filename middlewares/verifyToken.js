const jwk = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    // lay token tu nguoi dung
    const Authorization = req.header('Authorization');

    // neu token valid 
    if (Authorization){
        //Lay token /get token
        // gui token tu client toi server co dang 'Bearer <tokenkey>', can phai loai khoang trang de lay ma token
        const token = Authorization.replace('Bearer ', '');

        //Xac thuc token
        jwk.verify(token, process.env.APP_SECRET, (err, user)=>{
            if(err){
                res.staus(403).json("Token không khả dụng");
            }
            //gan token /assign token
            req.user = user;
            //de no di tiep vao controller
            next();
        });    
    }else{
        res.status(401).json("Bạn chưa đăng nhập")
    }
}

//Kiểm tra quyền được xóa người dùng khác
//Chỉ có Admin hoặc chính người đó mới được xóa tài khoản chính người đó
exports.verifyTokenAndAdminAuth = (req, res, next) => {
    this.verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            return next();
          } else {
            res.status(403).json("Bạn không được phép xóa tài khoản khác") ;
          }
    });
   
}

//Kiểm tra quyền  Admin
exports.checkAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        return next();
    } else {
        res.status(403).json("Bạn không phải là Admin");
    }
  };