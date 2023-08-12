const User = require('../model/User');
const Employee = require('../model/User');

const getAllUsers=async(req,res)=>{
    const users=await User.find();
    if(!users) return res.status(200).json({'message':'No users found'});
    return res.status(200).json(users);
}

const getUser=async(req,res)=>{
    if(!req?.params?.id) return res.status(400).json({'message':'ID parameter required'});

    const user=await User.findOne({_id:req.params.id});
    if(!user) return res.status(200).json({'message':`No with ID${req.params.id} not found`});
    return res.status(200).json(user);
}
module.exports={
    getAllUsers,
    getUser
}