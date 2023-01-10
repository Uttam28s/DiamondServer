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
        // main_carat: Number,
        // factory_carat: Number,
        occupy_by: String,
        assign_carat: Number,
        Id:Number,
        
        assign_pcs: Number,
        yeild : Number,
        return_carat : Number,
        return_pcs : Number,

        quality : String, 
        y_weight : Number,
        //  assign_name: String,
        //  piece: Number,
        // purity: String,
        // size: Number,
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
