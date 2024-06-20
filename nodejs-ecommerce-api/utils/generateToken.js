import jwt from 'jsonwebtoken';

const generateToken=(id) => {    
    return jwt.sign({id:id.toString()},process.env.JWT_KEY,{
        expiresIn:'3d'
    })
}

export default generateToken;