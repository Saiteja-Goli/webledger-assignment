const express = require("express");
const favouriteModel = require("../Models/FavouriteModel");

const favouriteRecipe_router = express.Router();

favouriteRecipe_router.get("/", (req, res) => {
  res.send("fav recipe");
});

favouriteRecipe_router.post("/add", async (req, res) => {
  try {
    const { recipe } = req.body;
    const existingRecipe = await favouriteModel.findOne({
      "recipe.id": recipe.id,
    });
    //Recipe Exists
    if (existingRecipe) {
      return res.status(400).json({ error: "Recipe already in favorites" });
    }
    //Recipe Not exists
    const favourite = new favouriteModel({ recipe });
    await favourite.save();
    res.status(201).send({ message: "Recipe added to favorites successfully" });
  } catch (error) {
    console.error("Error adding recipe to favorites:", error);
    res
      .status(500)
      .send({ error: "Error Occuring While Favouriting the Data" });
  }
});

favouriteRecipe_router.get("/get", async (req, res) => {
  try {
    const { user } = req;

    // Retrieve all favorite recipes for the user
    const favorites = await favouriteModel.find({ user: user.userID });

    res.status(200).json({ favorites });
  } catch (error) {
    console.error("Error while getting Fav recipe:", error);
    res
      .status(500)
      .send({ error: "Error Occuring While Getting Favourites Data" });
  }
});
module.exports = favouriteRecipe_router;
