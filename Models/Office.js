const mongoose = require("mongoose");

const objSchema = mongoose.Schema(
  {
    rough_id: {
      type: mongoose.ObjectId,
      ref: "Rough",
      required: true,
    },
    Id : Number,
    office_total_carat: Number,
    office_total_piece: Number,
    office_assigne_name: String,
    office_assigne_id : {
      type: mongoose.ObjectId,
      ref: "Employee",
      required: true,
    },
    loseCarat : Number,
    assign_date: Date,
    returnStatus: Boolean,
    return_date: Date,
    carat: Number,
    id: String,
    total_packet: Number,
    copyCarat: Number,
    packetNo: Number,
    office_return_sorting_carat: Number,
    mackable: Number
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Office", objSchema);
