import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

var checkUserAuth = async (req,resp,next) => {
    let token
    const {authorization} = req.headers
    if (authorization && authorization.startsWith('Bearer')){
        try{
            // Get token from header
            token = authorization.split(' ')[1]

            // verify token

            const{ user_id } = jwt.verify(token,process.env.JWT_SECRET_KEY)
            

            // Get user from token
            req.user = await UserModel.findById(user_id).select('-password')
            
            next()

        }catch (error) {
      console.log(error)
      resp.status(401).send({ "status": "failed", "message": "Unauthorized User" })
    }
  }
  if (!token) {
    resp.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
  }
}

export default checkUserAuth