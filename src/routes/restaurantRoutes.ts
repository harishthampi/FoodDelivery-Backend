import express from "express";
import { param } from "express-validator";
import restaurantController from "../controller/restaurantController";

const router = express.Router();

// api/restaurant
router.get('/:restaurantId', param("restaurantId")
.isString()
.trim()
.notEmpty()
.withMessage("Restaurant parameter must be a valid string"),
restaurantController.getRestaurant
);

router.get(
  //param("city") middleware checks that the city parameter is a string, trims it, and ensures it's not empty. If the validation fails, an error message will be generated.
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string"),
    restaurantController.searchRestaurants
);

export default router;