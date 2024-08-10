// sets up validation middleware for an Express route using the express-validator library
// This middleware ensures that the request body contains valid data for the fields name, addressLine1, and country.
import { NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { Request, Response } from "express";

//middleware function that checks for validation errors and sends a 400 response if any are found
const handleValidationErrors = async(req:Request,res:Response,next:NextFunction) =>{
    const errors = validationResult(req);//extracts the validation errors from the request object
    if(!errors.isEmpty()){
        return res.sendStatus(400).json({errors:errors.array()});
    }
    next();
}

export const validateMyUserRequest =[
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('addressLine1').isString().notEmpty().withMessage('Address must be a string'),
    body('country').isString().notEmpty().withMessage('Country must be a string'),
    handleValidationErrors,
];

export const validateMyRestaurantRequest =[
    body('restaurantName').isString().notEmpty().withMessage('Restaurant name is required'),
    body('city').isString().notEmpty().withMessage('City is required'),
    body('country').isString().notEmpty().withMessage('Country is required'),
    body('deliveryPrice').isFloat({min:0}).withMessage('Delivery price must be a positive number'),
    body('estimatedDeliveryTime').isInt({min:0}).withMessage('Estimated delivery time is required'),
    body('cuisines').isArray().withMessage('Cuisines must be an Array').not().isEmpty().withMessage('Cuisines are required'),
    body('menuItems').isArray().withMessage('Menu must be an Array'),
    body('menuItems.*.name').notEmpty().withMessage('Menu items name is required'),
    body('menuItems.*.price').isFloat({min:0}).withMessage('Menu items price is required'),
    handleValidationErrors,
];
