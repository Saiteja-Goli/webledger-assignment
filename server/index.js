const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { recipe_router } = require("./Routes/RecipeRoute");
const favouriteRecipe_router = require("./Routes/FavouriteRecipeRoute");
const connection = require("./Configs/db");
const user_router = require("./Routes/UserRouter");


const app = express();
app.use(express.json());
app.use(cors());

//Basic Route
app.get("/", (req, res) => {
  res.status(200).json({ Message: "Welcome To Server" });
});
//User Routes
app.use("/users", user_router);
app.use("/recipes", recipe_router);
app.use("/favourites", favouriteRecipe_router);

//Server example
app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected To Db ");
    console.log(`Listining on server ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
