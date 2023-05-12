const Jobpost = require('../models/Jobpost');
const Company = require('../models/Company');

//---------------------------tìm kiếm theo title và location-------------------------
exports.findJobpostBaseOnTitleAndLocation = async (req, res, next)=>{
    try{
      const title =   req.query.title;
      const location = req.query.location; 
      if(title && location == undefined) {
        const  post = await Jobpost.find({title:{$regex:title}});
        if(post[0] == undefined) return res.status(404).json("Không tìm thấy công việc phù hợp") ;
        return res.status(200).json({
          status: 'success',
          length: post.length,
          data: post
        });
      } else if(title == undefined && location){
          const  post = await Jobpost.find({fullAddress:{$regex:location}});
          if(post[0] == undefined) return res.status(404).json("Không tìm thấy công việc phù hợp") ;
          return res.status(200).json({
            status: 'success',
            length: post.length,
            data: post
          });
        } else if(title && location){
            const  post = await Jobpost.find({$and:[{fullAddress:{$regex:location}}, {title:{$regex:title}} ]});
            if(post[0] == undefined) return res.status(404).json("Không tìm thấy công việc phù hợp") ;
            // console.log(post[0] == undefined)
            return res.status(200).json({
              status: 'success',
              length: post.length,
              data: post
          });
        }else if(title == undefined && location == undefined) {return res.status(404).json("Vui lòng điền thông tin vào ô tìm kiếm") }; 
         
      
      
      
   
    }catch(error){
      console.log(error);
        res.json(error)
    }
  }

//---------------------------tìm kiếm Công ty-------------------------
exports.findCompany = async (req, res, next)=>{
    try{
      const company =  req.query.company;
      if(company == undefined) {
        return res.status(404).json("Vui lòng điền thông tin vào ô tìm kiếm") 
      } else if(company) {
        const  foundCompany = await Company.find({nameCompany:{$regex:company}});
        if(foundCompany[0] == undefined) return res.status(404).json("Không tìm thấy công ty này") ;
            return res.status(200).json({
              status: 'success',
              length: foundCompany.length,
              data: foundCompany
          });
      }
      
    }catch(error){
      console.log(error);
        res.json(error)
    }
  }