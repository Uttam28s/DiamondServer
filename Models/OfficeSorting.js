const mongoose = require("mongoose");

const objSchema = mongoose.Schema(
  {
    // rough_id: String,
    rough_id: {
      type: mongoose.ObjectId,
      ref: "Rough",
      required: true,
    },
    office_id: {
      type: mongoose.ObjectId,
      ref: "Offices",
      required: true,
    },
    mackable: Number,
    total_sorting_carat: Number,
    sortingData: Object,
    createDate: Date,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("OfficeSort", objSchema);
