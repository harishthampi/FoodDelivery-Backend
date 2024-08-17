import  express  from "express";
import multer from "multer";
import restaurantController from "../controller/myRestaurantController";
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
router.patch('/order/:orderId/status',jwtCheck,jwtParse,restaurantController.updateOrderStatus);
router.get('/order',jwtCheck,jwtParse,restaurantController.getMyRestaurantOrders);
router.get('/',jwtCheck,jwtParse,restaurantController.getRestaurant);
router.post('/',upload.single("imageFile"),validateMyRestaurantRequest,jwtCheck,jwtParse,restaurantController.createRestaurant);
router.put('/',upload.single("imageFile"),validateMyRestaurantRequest,jwtCheck,jwtParse,restaurantController.updateRestaurant);


export default router;