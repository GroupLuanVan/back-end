const User = require('../models/User');
const jwk = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next)=>{
    try {
        const { usernameInp, emailInp, passwordInp, roleInp, ...details } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.passwordInp, salt);
  
        //Create new user
        const newUser = await new User({
          username: usernameInp,
          email: emailInp,
          role: roleInp,
          password: hashed,
        });
  
        //Save user to DB
        if (roleInp == "admin") newUser.isAdmin = true;

        let savedUser = await newUser.save();
        if (roleInp !== "admin") {
            try {
                if (roleInp == "candidate") {
                const newCandidate = new Candidate({userId: savedUser._id, ...details});

                await newCandidate.save();
                } else if (roleInp == "recruiter") {
                    const newRecruiter = new Recruiter({userId: savedUser._id, ...details});
                    await newRecruiter.save();
                }
            } catch (e) {
            next(e);
            }
    }

    res.status(200).json("Tạo tài khoản thành công");
    } catch (err) {
    console.log(err);
    res.status(400).json("Tạo tài khoản thất bại");
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
            // .sign tạo token
            const token = jwk.sign({userId: user._id, isAdmin: user.isAdmin}, process.env.APP_SECRET);
            
            res.status(200).json({
                status: 'success',
                data: {token, userName: user.username}
            })
        }else{
            //Error: password is not correct
            res.status(404).json("Sai mật khẩu");
        }
    }catch(error){
        res.json(error);
    }
}
