const string = require("joi/lib/types/string");
const mongoose = require("mongoose");



const EmployeeTypeDetails = new mongoose.Schema({
    name: {
        type: String,
    },
});


const purityTypeDetails = new mongoose.Schema({
    purity : String
});

const objSchema = mongoose.Schema(
    {

            type: [EmployeeTypeDetails],
            purityType : [purityTypeDetails]
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Common", objSchema);
