const Jobpost = require('../models/Jobpost');

//Get All Post
exports.getAllJobposts = async (req, res, next)=>{
    try{
        //lay bai post dua tren ID sau day truy ra ten tac gia
        const jobpost = await Jobpost.find({}).populate('Company');
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
        
        //tao bai post
        const jobpost = await Jobpost.create({...req.body, company: userId});
        
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