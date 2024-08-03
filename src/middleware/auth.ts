import { auth } from "express-oauth2-jwt-bearer";
import{Request,Response,NextFunction} from "express";
import  jwt  from "jsonwebtoken";
import User from "../models/userModel";

declare global{
  //add custom properties to the express Request object -Typescript
  namespace Express{
    interface Request{
      auth0Id:string;
      userId:string;
    }
  }

}

export const jwtCheck = auth({
    //check the authorization header for a valid JWT token
    audience: process.env.AUTH0_AUDIENCE ,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: "RS256",
});

 //middleware which extracts the auth0Id from the token, finds the corresponding user in the database, and attaches user information to the request object.
  export const jwtParse = async(req:Request,res:Response,next:NextFunction) =>{
   
    const {authorization} = req.headers;
    console.log("Authorization:",authorization);
    
    if(!authorization || !authorization.startsWith("Bearer ")){
      return res.sendStatus(401).json({message:"Unauthorized"});
    }

    const token = authorization.split(" ")[1];

    try{
      //Decodes the token to extract the auth0Id (from the sub claim).
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      const auth0Id = decoded.sub;

      //Looks up the user in the database using the auth0Id.
      const user = await User.findOne({auth0Id})
      if(!user){
        return res.sendStatus(401);
      }

      //If the user is found, attaches auth0Id and userId to the request object and calls next() to pass control to the next route handler.
      req.auth0Id = auth0Id as string;
      req.userId = user._id.toString();
      next();

    }catch(error){
      console.log(error);
      res.sendStatus(401);
    }  
  } ;