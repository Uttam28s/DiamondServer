const string = require("joi/lib/types/string");
const mongoose = require("mongoose");



const EmployeeTypeDetails = new mongoose.Schema({
    name: String
});

const purityTypeDetails = new mongoose.Schema({
    purity : String
});

const factoryProcessType = new mongoose.Schema({
    process : String
})

const objSchema = mongoose.Schema(
    {

            type: [EmployeeTypeDetails],
            purityType : [purityTypeDetails],
            factoryProcessType : [factoryProcessType]
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Common", objSchema);
