const User = require('../models/User');
const jwk = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next)=>{
    try{
        //req.body gan thong so nguoi dung tuyen vao (name, email, password) / luu vao database
        const user = await User.create(req.body);
        const token = jwk.sign({userId: user._id}, process.env.APP_SECRET);

        res.status(200).json({
            status: 'success',
            data: {token, userName: user.name}
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
        }

        if(bcrypt.compareSync(req.body.password, user.password)){
            const token = jwk.sign({userId: user._id}, process.env.APP_SECRET);
            res.status(200).json({
                status: 'success',
                data: {token, userName: user.name}
            })
        }else{
            //Error: password is not correct
        }
    }catch(error){
        res.json(error);
    }
}