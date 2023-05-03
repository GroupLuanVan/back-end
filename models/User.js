const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    
    email:{type: String, unique: true, trim: true, required: [true, 'Email không được để trống']},
    password:{type: String, trim: true, required: [true, 'Password không được để trống'], minlenght:[6, 'Password phải có ít nhất 6 ký tự'] },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
}, {timestamps: true})

// userSchema.pre('save',function(next){
//     let user = this;
//     bcrypt.hash(user.password, 10, function(error, hash){
//         if (error){
//             return next(error);
//         }else{
//             user.password = hash;
//             next()
//         }
//     })
// })
const User = mongoose.model('User', userSchema);

module.exports = User;