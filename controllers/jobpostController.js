const Jobpost = require('../models/Jobpost');
const Company = require ('../models/Company');
const Jobcategory = require ('../models/Jobcategory');
// const Worktype = require ('../models/Worktype');
// const Workexp = require ('../models/Workexp');
const Position = require ('../models/Position');

//Get All Post
exports.getAllJobposts = async (req, res, next)=>{
    try {
    let rs;
    let queryLen = Object.keys(req.query).length;
    let titleQuery = "";

    if (req.query && req.query.title) {
      titleQuery = req.query.title;
      req.query = filterSkipField(req.query, "title");
    }
    let cnt;
    if (queryLen > 0) {
      const queryTool = new QueryTool(
        Jobpost.find({
          title: { $regex: new RegExp(titleQuery), $options: "i" },
        }).populate("companyId"),
        req.query
      ).filter();

      const page = req.query.page * 1 || 1;
      const limitNum = req.query.limit * 1 || 12;
      const skipNum = (page - 1) * limitNum;

      let frs = await queryTool.query;
      cnt = frs.length;
      rs = frs.slice(skipNum, skipNum + limitNum);
    } else {
      cnt = await Jobpost.find().count();
      rs = await Jobpost.find().populate("companyId").limit(12);
    }
    let pageCnt = Math.floor(cnt / 12);
    if (cnt % 12 !== 0) pageCnt += 1;
    res.status(200).json({ jobsPage: rs, pageCnt: pageCnt });
  } catch (err) {
    next(err);
  }
}

// Get All Post base on Company
exports.getAllJobpostsBaseOnCompany = async (req, res, next)=>{
    try{
        //lay bai post dua tren ID sau day truy ra ten tac gia
        const jobpost = await Jobpost.find(req.query).populate('companyId');
        //post.length: dem co bao nhieu bai post
        res.status(200).json({
            status: 'success',
            results: posts.length,
            data:{jobpost}
        })
    }catch(error){
        res.json(error)
    }
}

//Create One Post
exports.createOneJobpost = async (req, res, next)=>{
    try{
        const {userId} = req.user;
        
        //tìm công ty theo userId
        let company = await Company.findOne({ userId });
        const jobpost = new Jobpost({
            ...req.body,
            companyId: company._id
        });
        await jobpost.save();
        
        res.status(200).send("Tạo jobpost thành công!");
    }catch(error){
        console.log(error);
        return res.status(404).json("Tạo bài đăng tuyển dụng không thành công");
    }
}

//Update One Post
exports.updateOneJobpost = async (req, res, next)=>{
    try{
        const {jobpostId} = req.param;
        
        //chinh sua post
        //new: true -> thay vi phan hoi bai post cu thi no phan hoi bai post moi
        const jobpost =  await Jobpost.findByIdAndUpdate(jobpostId, {...req.body}, {new: true, runValidator: true});
        
        res.status(200).json({
            status: 'success',
            data:{jobpost}
        })
    }catch(error){
        res.json(error)
    }
}

//Delete One Post
exports.deleteOneJobpost = async (req, res, next)=>{
    try{
        const {jobpostId} = req.param;
        
        //xoa post
        //new: true -> thay vi phan hoi bai post cu thi no phan hoi bai post moi
        await Jobpost.findByIdAndDelete(jobpostId);
        
        res.status(200).json({
            status: 'success',
            message:'Post has been delete'
        })
    }catch(error){
        res.json(error)
    }
}