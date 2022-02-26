const mongoose = require("mongoose");

const objSchema = mongoose.Schema(
  {
    // rough_id: String,
    rough_id: {
      type: mongoose.ObjectId,
      ref: "Rough",
      required: true,
    },
    total_sorting_amount: Number,
    total_sorting_carat: Number,
    sortingData: [],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Sort", objSchema);
