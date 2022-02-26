const { string } = require("joi");
const mongoose = require("mongoose");

const objSchema = mongoose.Schema(
  {
    sellername: String,
    brokername: String,
    id: String,
    //rough_id : Number,
    completed: Boolean,
    carat: Number,
    rate: Number,
    key: Number,
    officecarat: Number,
    factorycarat: Number,
    rough_total: Number,
    days: Number,
    date: Date,
    lastdate: Date,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Rough", objSchema);
