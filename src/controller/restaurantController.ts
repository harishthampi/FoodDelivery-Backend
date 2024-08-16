import { query, Request, Response } from "express";
import Restaurant from "../models/restaurantModel";

const getRestaurant = async (req: Request, res: Response) => {
  try{
    const restaurantId = req.params.restaurantId;
    const restaurant = await Restaurant.findById(restaurantId);
    if(!restaurant){
      return res.status(404).json({message:"Restaurant not found"});
    }

    res.json(restaurant);
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:"Error"});
  }
}

const searchRestaurants = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;
    //extract query string parameters from the request object.
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    //Creates an empty object called query.
    let query: any = {};
    //Adds a condition to the query object where the key is "city".
    //The value is a case-insensitive regular expression that matches the city parameter.
    query["city"] = new RegExp(city, "i");
    //Counts the number of documents in the Restaurant collection that match with the city.
    const cityCheck = await Restaurant.countDocuments(query);
    if (cityCheck === 0) {
      return res.status(404).json({
        data:[],
        pagination:{
          total:0,
          page:1,
          pages:1,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",") //converts Italian,Mexican,Chinese to [Italian,Mexican,Chinese]
        .map((cuisine) => new RegExp(cuisine, "i")); //converts each cuisine into a case-insensitive regular expression.
      query["cuisines"] = { $all: cuisinesArray };//Adds a condition to the query object where the key is "cuisines". The $all operator is used to match all elements in an array against the cuisinesArray.
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex }, // condition checks if the restaurantName field matches the searchRegex. If the restaurant's name contains the search query, it will match.
        { cuisines: { $in: [searchRegex] } }, //condition checks if any of the elements in the cuisines field matches the searchRegex. The $in operator is used to match any element in an array against the regular expression.
      ];
    }
    const pageSize = 10;//Sets the number of results to display per page.
    const skip = (page - 1) * pageSize;//Calculates the number of documents to skip based on the page number and page size.
    //Finds all documents in the Restaurant collection that match the query object.
    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);
    const response = {
        data:restaurants,
        pagination:{
          total,
          page,
          pages:Math.ceil(total/pageSize),
        },
    }
    res.json(response);

  } 
  catch (error) {
    console.log(error);
    res.status(500).json({ message: " Error" });
  }
};

export default { searchRestaurants,getRestaurant };
