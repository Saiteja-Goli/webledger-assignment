const axios = require("axios");
const express = require("express");
require("dotenv").config();

const recipe_router = express.Router();


recipe_router.get("/", async (req, res) => {
  try {
    const spoonacularApiKey = process.env.api_key;
    const api_url = `https://api.spoonacular.com/recipes/random?apiKey=f186ddc686dc40e4917e57a471aa0835&number=50`;
    const response = await axios.get(api_url);
    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res
        .status(500)
        .json({ error: "Error Occurring While Fetching the Data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

recipe_router.post("/search", async (req, res) => {
  try {
    const { searchValue } = req.body;
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=f186ddc686dc40e4917e57a471aa0835&query=${searchValue}`;
    const searchResponse = await axios.get(url);

    if (searchResponse.status === 200) {
      const searchResponseData = searchResponse.data;
      res.status(200).json(searchResponseData);
    } else {
      res
        .status(500)
        .json({ error: "Error Occurring While Searching the Data" });
    }
  } catch (error) {
    console.error("Error in '/search' endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { recipe_router };
