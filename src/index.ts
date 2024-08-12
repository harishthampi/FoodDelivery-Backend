import  express,{Request,Response}  from "express";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";
import userRouter from "./routes/userRoute";
import {v2 as cloudinary} from "cloudinary";
import myRestaurantRouter from "./routes/myRestaurantRoutes";
import restaurantRoutes from "./routes/restaurantRoutes";
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
.then(()=>{
    console.log("Connected to MongoDB");

    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET,
    })
});


const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
    res.send({message:"Health is OK!"})
})

app.use('/api/user',userRouter);
app.use('/api/my/restaurant',myRestaurantRouter);
app.use('/api/restaurant',restaurantRoutes);

app.listen(7000,()=>{
    console.log("Server is running on port 7000");
});
