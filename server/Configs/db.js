const mongoose = require('mongoose');
require('dotenv').config();

const connection = mongoose.connect("mongodb+srv://saiteja:saiteja@cluster0.e6urlag.mongodb.net/Recipes?retryWrites=true&w=majority");
 module.exports= {connection}