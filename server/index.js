const express = require("express");
const cors = require("cors");

const recipe_router = require("./Routes/RecipeRoute");
const favouriteRecipe_router = require("./Routes/FavouriteRecipeRoute");
const connection = require("./Configs/db");
const app = express();
app.use(express.json());
app.use(cors());

//Basic Route
app.get("/", (req, res) => {
  res.status(200).json({ Message: "Welcome To Server" });
});

//Recipes Route
app.use("/recipes", recipe_router);
app.use("/favourites", favouriteRecipe_router);

//Server example
app.listen(8000, async () => {
  try {
    await connection;
    console.log("Connected To Db");
    console.log("Listining on server 8000");
  } catch (error) {
    console.log(error);
  }
});
