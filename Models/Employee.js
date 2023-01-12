const string = require("joi/lib/types/string");
const mongoose = require("mongoose");

const objSchema = mongoose.Schema(
    {
        workPlace : String,
        positions : String,
        emp_Id : String,
        name : String,
        address : String,
        id: String,
        salaryType : String,
        salaryAmount : Number,
        phoneNo : Number,
        aadharCardNumber : Number,
        panNo : String,
        bankName : String,
        bankAccountNo : String
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Employee", objSchema);
