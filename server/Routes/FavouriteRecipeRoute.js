const express = require("express");
const authentication = require("../Middleware/authenication");

const favouriteModel = require("../Models/FavouriteModel");

const favouriteRecipe_router = express.Router();

favouriteRecipe_router.get("/", (req, res) => {
  res.send("fav recipe");
});
//Adding To Favorite
favouriteRecipe_router.post("/add", authentication, async (req, res) => {
  try {
    const { title, image } = req.body;
    const existingRecipe = await favouriteModel.findOne({
      title,
      userId: req.user._id,
    });
    // Recipe Exists
    if (existingRecipe) {
      return res.status(400).json({ error: "Recipe already in favorites" });
    }
    // Recipe Does Not Exist
    const favourite = new favouriteModel({
      title,
      image,
      userId: req.user._id,
    });
    await favourite.save();
    res.status(201).json({ message: "Recipe added to favorites successfully" });
  } catch (error) {
    console.error("Error adding recipe to favorites:", error);
    res.status(500).json({ error: "Error Occurred While Favoriting the Data" });
  }
});
//Sending Favorites
favouriteRecipe_router.get("/get", authentication, async (req, res) => {
  try {
    // Retrieve all favorite recipes for the user
    let favorites = await favouriteModel.find({ userId: req.user._id });
    res.status(200).json({ favorites });
  } catch (error) {
    console.error("Error while getting Fav recipe:", error);
    res
      .status(500)
      .send({ error: "Error Occuring While Getting Favourites Data" });
  }
});
//Deleting Favourites
favouriteRecipe_router.delete('/delete', async (req, res) => {
  try {
    const { title, image } = req.body;
    const deletedRecipe = await favouriteModel.findOneAndDelete({
      title,
      image,
    });
    if (deletedRecipe) {
      res.status(200).json({ message: 'Recipe removed from favorites successfully' });
    } else {
      res.status(404).json({ error: 'Recipe not found in favorites' });
    }
  } catch (error) {
    console.error('Error removing recipe from favorites:', error);
    res.status(500).json({ error: 'Error occurred while removing from favorites' });
  }
});

module.exports = favouriteRecipe_router;
