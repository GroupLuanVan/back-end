const mongoose = require ('mongoose');
const Address = require ('./Address.js');
// const Company = require ('./Company.js');

// const Worktype = require ('./Worktype.js');
// const Workexp = require ('./Workexp.js');
// const Position = require ('./Position.js');


const jobpostSchema = new mongoose.Schema({
    //tieu de
    title: { type: String },

    //dia chi
    addressId: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
      required: true
    },
    
    //so luong
    amount: { type: Number },

    //hinh thuc lam viec (toan thoi gian, ban thoi gian)
    workType: {
      type: String,
      enum: ["Toàn thời gian", "Bán thời gian", "Làm từ xa"]
    },
    status: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },
    //ngay het han nhan ho so
    endDate: { type: Date },

    //kinh nghiem lam viec
    workExp: {
      type: String,
      enum: ["Không yêu cầu", "Dưới 1 năm", "1 năm", "2 năm", "3 năm", "4 năm", "5 năm", "Trên 5 năm"]
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

    //muc luong ( thoa thuan, trong khoang)
    salaryType: {
      type: String,
      enum: ["Thỏa thuận", "Trong khoảng"]
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
    descriptionText: {
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
    
    requiredText: {
      type: String,
    },
    // quyen loi
    benefit: {
      type: String,
    },


    

    // id cong ty
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
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