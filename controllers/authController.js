const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');
const Resume = require('../models/Resume');
const jwk = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { filterSkipField } = require('../middlewares/common');

exports.register = async (req, res, next)=>{
try{
  //req.body gan thong so nguoi dung tuyen vao (name, email, password) / luu vao database
  const user = await User.create(req.body);
  const token = jwk.sign({userId: user._id}, process.env.APP_SECRET);

  res.status(200).json({
      status: 'success',
      data: {userName: user.name},
      message: "Tạo tài khoản thành công"
  })
} catch (error) {
  res.json(error);
}    
}

exports.login = async (req, res, next)=>{
  try{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        // Error: Email is not correct
        res.status(404).json("Email này chưa được đăng ký");
    }

    if(bcrypt.compareSync(req.body.password, user.password)){
        const token = jwk.sign({userId: user._id}, process.env.APP_SECRET);
        res.status(200).json({
            status: 'success',
            data: {token, userName: user.name, userRole: user.role}
        })
    }else{
        //Error: password is not correct
        res.status(404).json("Sai mật khẩu");
    }
    }catch(error){
      res.status(404).json("Đăng nhập không thành công");
}
};