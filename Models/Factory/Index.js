const mongoose = require("mongoose");

const objSchema = mongoose.Schema(
  {
    rough_id: {
      type: mongoose.ObjectId,
      ref: "Rough",
      required: true,
    },
    factory_total_carat: Number,
    factory_total_piece: Number,
    factory_assigne_name: String,
    assign_date: Date,
    returnStatus: Boolean,
    return_date: Date,
    carat: Number,
    id: String,
    total_packet: Number,
    copyCarat: Number,
    packetNo: Number,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Factory", objSchema);
