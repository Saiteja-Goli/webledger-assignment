const mongoose = require("mongoose");

const favouriteSchema = mongoose.Schema({
  title: { type: "string" },
  image: { type: "string" },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

const favouriteModel = mongoose.model("favourite", favouriteSchema);

module.exports = favouriteModel;
