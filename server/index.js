const express = require("express");
const cors = require("cors");

const recipe_router = require("./Routes/RecipeRoute");
const app = express();
app.use(express.json());
app.use(cors());

//Basic Route
app.get("/", (req, res) => {
  res.status(200).json({ Message: "Welcome To Server" });
});

//Recipes Route
app.use("/recipes",recipe_router);
app.use("/favourites",)

//Server example
app.listen(8000, () => {
  try {
    console.log("Listining on server 8000");
  } catch (error) {
    console.log(error);
  }
});
