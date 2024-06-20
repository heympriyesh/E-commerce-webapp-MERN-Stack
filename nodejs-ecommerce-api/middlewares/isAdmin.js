import User from "../model/User.js";

const isAdmin=async (req,res,next)=>{
    const user=await User.findById(req.userAuthId);

    // check if admin
    if(user.isAdmin)
        next();
    else
        next(new Error('Access denied, admin only'))
}

export default isAdmin;