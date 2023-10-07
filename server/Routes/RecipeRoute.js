const express = require("express");
const axios = require("axios");
const recipe_router = express.Router();

//Fetching the Recipes from the third-party URL
recipe_router.get("/", async (req, res) => {
  const api_key = "fc8138ca53854bb8808b2727d5b960e6";
  try {
    let url = `https://api.spoonacular.com/recipes/random?apiKey=${api_key}&number=20`;
    let responseData = await axios.get(url);
    res.status(200).send(responseData.data);
  } catch (error) {
    res.status(500).send({ error: "Error Occuring While Fetching the Data" });
  }
});


//Searching the Recipe by Name
recipe_router.post("/search", async (req, res) => {
  const api_key = "fc8138ca53854bb8808b2727d5b960e6";
  try {
    const { searchValue } = req.body;
    console.log(req.body)
    console.log(searchValue)
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${api_key}&query=${searchValue}`;
    let searchResponseData = await axios.get(url);
    res.status(200).send(searchResponseData.data);
  } catch (error) {
    res.status(500).send({ error: "Error Occuring While Searching the Data" });
  }
});

module.exports = recipe_router;
