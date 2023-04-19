const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Company = require('../models/Company');
const Resume = require('../models/Resume');
const jwk = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { filterSkipField } = require('../middlewares/common');

exports.register = async (req, res, next)=>{
  // try{
    //req.body gan thong so nguoi dung tuyen vao (name, email, password) / luu vao database
//     if(req.body.role == "candidate"){
//       const user = await User.create(req.body);
//       const newCandidate = await Candidate.create({userId: user._id, userEmail: user.email,});
      
//     }else if (req.body.role == "recruiter"){
//       const user = await User.create(req.body);
//       const newCompany = await Company.create({userId: user._id, userEmail: user.email, nameCompany: req.body.nameCompany, location: req.body.location});
     
//     } 
//     res.status(200).json({
//       status: 'success',
//       message: "Tạo tài khoản thành công"
//     })
//   } catch (error) {
//     return res.status(404).json("Tạo tài khoản không thành công");
//   }    
// }
  try{
    let email = await User.findOne({email:req.body.email});
    if(email) return res.status(200).json("Email này đã được đăng ký");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
      password: hash,
    });
    if (req.body.role == "admin") user.isAdmin = true;

    await user.save();
    if (req.body.role !== "admin") {
      try {
        if (user.role == "candidate") {
          const newCandidate = new Candidate({
            userId: user._id,
            email: user.email,
            gender: req.body.gender
          });

          await newCandidate.save();
        } else if (user.role == "recruiter") {
          const newCompany = new Company({
            userId: user._id,
            email: user.email,
            nameCompany: req.body.nameCompany,
            location: req.body.location,
            phone: req.body.phone,
          });
          await newCompany.save();
        }
      } catch (e) {
        next(e);
      }
    }
    res.status(200).json("Tạo tài khoản thành công");
  } catch (error) {
    console.log(error);
    return res.status(404).json("Tạo tài khoản không thành công");
  }
}

exports.login = async (req, res, next)=>{
  try{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        // Error: Email is not correct
        return res.status(404).json("Email này chưa được đăng ký");
    }

    if(bcrypt.compareSync(req.body.password, user.password)){
      const token = jwk.sign({userId: user._id, isAdmin: user.isAdmin}, process.env.APP_SECRET);
      
      if(user.role == "candidate"){
        let candidate = await Candidate.findOne({ email: user.email });
        return res.status(200).json({
          status: 'success',
          data: {token, user, candidate}
        })
      }else if(user.role == "recruiter"){
        let company = await Company.findOne({ email: user.email });

        return res.status(200).json({
          status: 'success',
          data: {token, user, company}
        })
      }



      



    }else{
        //Error: password is not correct
        return res.status(404).json("Sai mật khẩu");
    }
    }catch(error){
      console.log(error)
      return res.status(404).json("Đăng nhập không thành công");
}





// try {

//   const user = await User.findOne({ email: req.body.email });

//   if (!user) return res.status(404).json("Email chưa được đăng ký");

//   const isPasswordCorrect = await bcrypt.compare(
//     req.body.password,
//     user.password
//   );
//   if (!isPasswordCorrect)
//     return res.status(404).json("Sai mật khẩu");
//     ;

//     const token = jwk.sign({userId: user._id, isAdmin: user.isAdmin}, process.env.APP_SECRET);

//   let resUser = user._doc;
//   if (user.role == "recruiter") {
//     const recDetail = await Company.findOne({ userId: user._id }).select({
//       _id: 0
//     });
//     resUser = { ...resUser, ...recDetail._doc };
//   } else if (user.role == "candidate") {
//     let candidate = await Candidate.findOne({ userId: user._id })
//     const activeCvId = await Resume.findOne({
//       candidateId: candidate._id,
//     }).select("_id");

//     candidate = filterSkipField(candidate._doc, "_id")
//     if (activeCvId) {
//       resUser = { ...resUser, ...candidate, activatedCvId: activeCvId._id, };
//     } else {
//       resUser = { ...resUser, ...candidate };
//     }

//   }

//   delete resUser.password;



// } catch (err) {
//   console.log("---------", err)
//   return res.status(404).json("Đăng nhập không thành công");
// }
};