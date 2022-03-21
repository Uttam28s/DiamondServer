const {array} = require("joi");
const mongoose = require("mongoose");

const objSchema = mongoose.Schema(
    {
        factory_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "factories",
            required: true,
        },
        id: String,
        //process_name: String,
        last_carat: Number,
        main_carat: Number,
        factory_carat: Number,
        occupy_by: String,
        assign_carat: Number,
        //  assign_name: String,
        //  piece: Number,
        // purity: String,
        // size: Number,
        //  yeild: Number,
        assign_date: Date,
        return_date: Date,
        return: Boolean,
        all_process: Array,
        srno: Number,


    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("FactoryPacket", objSchema);
