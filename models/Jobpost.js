const mongoose = require ('mongoose');
const Address = require ('./Address.js');
// const Company = require ('./Company.js');
// const Jobcategory = require ('./Jobcategory.js');
// const Worktype = require ('./Worktype.js');
// const Workexp = require ('./Workexp.js');
// const Position = require ('./Position.js');


const jobpostSchema = new mongoose.Schema({
    //tieu de
    title: { type: String },

    //dia chi
    addressId: {
      type: mongoose.Schema.ObjectId,
      ref: "Addresss",
      required: true
    },
    
    //so luong
    amount: { type: Number },

    //hinh thuc lam viec (toan thoi gian, ban thoi gian)
    workTypeId: {
      type: mongoose.Schema.ObjectId,
      ref: "Worktype",
      required: true
    },

    //ngay het han nhan ho so
    endDate: { type: Date },

    //kinh nghiem lam viec
    workExpId: {
      type: mongoose.Schema.ObjectId,
      ref: "Workexp",
      required: true
    },

    //vi tri lam viec (fresher, intern,... )
    positionId: {
      type: mongoose.Schema.ObjectId,
      ref: "Position",
      required: true
    },

    //gioi tinh
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Không yêu cầu"],
    },

    // don vi tien te
    currency: {
      type: String,
      enum: ["USD", "VND"],
      default: "USD",
    },

    //muc luong ( thoa thuan, trong khoan)
    salaryTypeId: {
      type: mongoose.Schema.ObjectId,
      ref: "Salarytype",
      required: true
    },

    // muc luong thap nhat
    salaryMin: {
      type: Number, default: 0
    },

    // muc luong cao nhat
    salaryMax: {
      type: Number, default: 999999999
    },

    // dia chi day du
    fullAddress: {
      type: String,
    },

    // mo ta cong viec
    description: {
      type: String,
    },

    //yeu cau cong viec
    required: {
      type: String,
    },

    // quyen loi
    benefit: {
      type: String,
    },

    // loai cong viec (Back-end,...)
    jobcategoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "Jobcategory",
      required: true,
    },

    // id cong ty
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
      required: true,
    },

    // id nguoi tuyen dung
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

    //luot xem
    viewCount: {
      type: Number,
      default: 0
    }
}, {timestamps: true})

const Jobpost = mongoose.model('Jobpost', jobpostSchema);

module.exports = Jobpost;