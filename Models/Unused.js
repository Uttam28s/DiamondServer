const mongoose = require("mongoose");

const objSchema = mongoose.Schema(
  {
    rough_id: {
      type: mongoose.ObjectId,
      ref: "Rough",
      required: true,
    },
    carat: Number,
    copyCarat: Number,
    after_sorting_carat: Number,
    before_office_carat: Number,
    after_office_carat: Number,
    before_factory_carat: Number,
    after_factory_carat: Number,
    mackable: Number,
    office_return_sorting_carat: Number,

  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Unused", objSchema);
