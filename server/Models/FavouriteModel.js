const mongoose = require("mongoose");

const favouriteSchema = mongoose.Schema({
  recipe: { type: Object },
});

const favouriteModel = mongoose.model("favourite", favouriteSchema);

module.exports = favouriteModel;
