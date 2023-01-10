    const mongoose = require("mongoose");

const objSchema = mongoose.Schema(
    {
        rough_id: {
            type: mongoose.ObjectId,
            ref: "Rough",
            required: true,
        },
        Id : Number,
        factory_total_carat: Number,
        // office_total_piece: Number,
        factory_assigne_name: String,
        assign_date: Date,
        returnStatus: Boolean,
        return_date: Date,
        carat: Number,
        id: String,
        polished : Number,
        loseCarat : Number,
        // copyCarat: Number,
        //  total_packet: Number,
        returnCarat : Number,
        copyCarat: Number,
        packetNo: Number,

        factory_total_pcs : Number,
        polished_pcs : Number,
       // all_process: Array,
        occupy: Boolean,
        lastCarat: Number,
        main_carat: Number,
        srno:Number

        // office_return_sorting_carat: Number,
        //   mackable: Number
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Factory", objSchema);
