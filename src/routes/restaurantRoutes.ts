import  express  from "express";
import multer from "multer";
import restaurantController from "../controller/restaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";


const router = express.Router();

const storage = multer.memoryStorage();
//configures multer to store the uploaded file in memory (RAM) instead of on disk.
const upload = multer({
    //Stores the uploaded file in memory and limits the file size to 5MB.
    storage:storage,
    limits:{
        fileSize:5*1024*1024 //5MB
    }
})


// /api/restaurant
router.get('/',jwtCheck,jwtParse,restaurantController.getRestaurant);
router.post('/',upload.single("imageFile"),validateMyRestaurantRequest,jwtCheck,jwtParse,restaurantController.createRestaurant);
router.put('/',upload.single("imageFile"),validateMyRestaurantRequest,jwtCheck,jwtParse,restaurantController.updateRestaurant);


export default router;