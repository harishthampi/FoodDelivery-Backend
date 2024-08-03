import express from "express";
import { Request, Response } from "express";
import User from "../models/userModel";

// ------------- CREATE USER ---------------

const createUser = async (req: Request, res: Response) => {
  //1.Check if the user already exists in the database
  try{
    const { auth0Id } = req.body;
    console.log("auth0Id:",auth0Id);
    
    const existingUser = await User.findOne({auth0Id});
    console.log("Existing User:",existingUser);
    
    if(existingUser){
      return res.status(200).send();
    }

    //2.If the user does not exist, create a new user
    const newUser = new User(req.body);   
    console.log("New User:",newUser);
    await newUser.save();
    
    res.status(201).json(newUser.toObject())
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:"Error in creating new user"});
  }
};

// ------------- UPDATE USER ---------------

const updateUser = async (req:Request,res:Response) =>{
  try{
    const{name,addressLine1,country,city} = req.body;
    console.log("Request:",req.body);
    
    const user = await User.findById(req.userId)
    console.log("User:",user);
    
    if(!user){
      return res.status(401).json({message:"User not found!!"});
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;
    user.city = city;

    await user.save();
    res.send(user);
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:"Error in updating user"});
  
  }
}

const getUser = async(req:Request,res:Response) =>{
  try{
    const currentUser = await User.findOne({_id:req.userId});
    if(!currentUser){
      return res.status(404).json({message:"User not found"});
    }
    res.json(currentUser);
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:"Error in getting user"});
    
  }
}

export default {
  createUser,
  updateUser,
  getUser,
};


