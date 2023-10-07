const express = require("express");

const favouriteRecipe_router = express.Router();

favouriteRecipe_router.get("/", (req, res) => {
  res.send("fav recipe");
});
