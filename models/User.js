const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username:{type: String, unique: true, trim: true, required: [true, 'Name must be required']},  //trim: cat dang truoc va sau ten
    email:{type: String, unique: true, trim: true, required: [true, 'Email must be required']},
    password:{type: String, trim: true, required: [true, 'Password must be required'], minlenght:[6, 'Password must be at least 6 character'] },
    role: {
        // type: String,
        // enum: ["candidate", "recruiter", "admin"],
        // default: "candidate",
        type: String,
        required: true
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