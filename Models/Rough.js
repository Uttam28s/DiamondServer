const { string } = require("joi");
const mongoose = require("mongoose");

const objSchema = mongoose.Schema(
  {
    sellername: String,
    brokername: String,
    id: String,
    Id : String,
    //rough_id : Number,
    completed: Boolean,
    carat: Number,
    rate: Number,
    key: Number,
    days: Number,
    date: Date,
    lastdate: Date,
    
    
    rough_total: Number,
    office_allocated_carat: Number,
    factory_allocated_carat: Number,
    
    // office_returned_carat : Number,
    // office_losed_carat : Number,
    // factory_returned_carat : Number,
    // factory_losed_carat : Number,

  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Rough", objSchema);
