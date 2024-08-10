import { Request, Response } from 'express';
import Restaurant from '../models/restaurantModel';
import cloudinary from "cloudinary";
import mongoose from 'mongoose';

const getRestaurant = async(req:Request,res:Response)=>{
    try{
        const restaurant = await Restaurant.findOne({user:req.userId});
        if(!restaurant){
            return res.send(404).json({message:"Restaurant not found!"});
        }
        res.json(restaurant);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong!"});
    }
}

const createRestaurant = async(req:Request,res:Response)=>{
    try{
        const existingRestaurant = await Restaurant.findOne({user:req.userId});

        if(existingRestaurant){
            return res.status(409).json({message:"Restaurant already exists!"});
        }
        //upload the image to Cloudinary
        const imageUrl = await uploadImage(req.file as Express.Multer.File);

        //create a new restaurant object
        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = imageUrl;
        // assign unique identifier to the user field of the restaurant document.
        restaurant.user = new mongoose.Types.ObjectId(req.userId);//// Ensures correct format of the user field
        restaurant.lastUpdated = new Date();
        await restaurant.save();

        res.status(201).send(restaurant);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong!"});
    }
}

const updateRestaurant = async(req:Request,res:Response) => {
    try{
        const restaurant = await Restaurant.findOne({user:req.userId});
        if(!restaurant){
            return res.status(404).json({message:"Restaurant not found!"});
        }
        restaurant.restaurantName = req.body.restaurantName;
        restaurant.city = req.body.city;
        restaurant.country = req.body.country;
        restaurant.deliveryPrice = req.body.deliveryPrice;
        restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        restaurant.cuisines = req.body.cuisines;
        restaurant.menuItems = req.body.menuItems;
        restaurant.lastUpdated = new Date();
        
        if(req.file){
            const imageUrl = await uploadImage(req.file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;
        }
        await restaurant.save();
        res.status(200).send(restaurant);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong!"});
    }
}

const uploadImage = async(file:Express.Multer.File)=>{
    //cast the req.file object to the Express.Multer.File type to help TypeScript understand the shape of the req.file object
    const image = file;
    //convert the image to a base64 string
    const base64Image = Buffer.from(image.buffer).toString("base64");
    //create a data URI from the base64 image
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    //upload the image to Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
}
export default {getRestaurant,createRestaurant,updateRestaurant};